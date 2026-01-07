
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Star } from 'lucide-react';
import { sendCandidateAddedEmail } from '@/lib/mail';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { seedDatabase } from '@/lib/seed';


// This should be defined in a types file
export interface Candidate {
  id: string;
  name: string;
  party: string;
  manifesto: string;
  imageUrl: string;
  email: string;
  idImageUrl: string;
}

export interface Vote {
    id: string;
    candidateId: string;
}


function CandidateCard({ candidate, onEdit, onDelete, voteCount }: { candidate: Candidate, onEdit: () => void, onDelete: () => void, voteCount: number }) {
  return (
    <Card className="group relative flex flex-col overflow-hidden text-center transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 bg-primary [clip-path:polygon(0_0,_100%_0,_100%_80%,_0_100%)]">
             <Image 
                src={candidate.imageUrl} 
                alt={candidate.name} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center p-6">
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-accent/90 px-2 py-1 text-xs font-bold text-accent-foreground">
          <Star className="h-3 w-3" />
          <span>{voteCount}</span>
        </div>
        <CardContent className="p-0 flex-grow">
          <h3 className="text-lg font-bold">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">{candidate.party}</p>
        </CardContent>
        <div className="mt-4 flex w-full items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Edit className="mr-2 h-3 w-3" /> Edit
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </Card>
  );
}


export default function CandidateList() {
  const firestore = useFirestore();
  
  useEffect(() => {
    if (firestore) {
      seedDatabase(firestore);
    }
  }, [firestore]);

  const candidatesRef = useMemoFirebase(() => firestore ? collection(firestore, 'candidates') : null, [firestore]);
  const { data: candidates, isLoading: candidatesLoading, error: candidatesError } = useCollection<Candidate>(candidatesRef);
  
  const votesRef = useMemoFirebase(() => firestore ? collection(firestore, 'votes') : null, [firestore]);
  const { data: votes, isLoading: votesLoading, error: votesError } = useCollection<Vote>(votesRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Partial<Candidate>>({});
  
  const getVoteCount = (candidateId: string) => {
    if (!votes) return 0;
    return votes.filter(vote => vote.candidateId === candidateId).length;
  };

  const handleSave = async () => {
    if (!firestore) return;
    if (!currentCandidate.name || !currentCandidate.party || !currentCandidate.email) {
        alert("Name, Party, and Email are required.");
        return;
    }

    if (isEditing && currentCandidate.id) {
        const candidateDocRef = doc(firestore, 'candidates', currentCandidate.id);
        updateDocumentNonBlocking(candidateDocRef, currentCandidate);
    } else {
        const newCandidate: Omit<Candidate, 'id'> = {
            name: currentCandidate.name,
            party: currentCandidate.party,
            email: currentCandidate.email,
            manifesto: currentCandidate.manifesto || 'New candidate manifesto.',
            idImageUrl: currentCandidate.idImageUrl || 'https://picsum.photos/seed/id-' + Date.now() + '/400/400',
            imageUrl: currentCandidate.imageUrl || 'https://picsum.photos/seed/' + Date.now() + '/400/400',
        };
        if (candidatesRef) {
          const newDocRef = await addDocumentNonBlocking(candidatesRef, newCandidate);
          if (newDocRef) {
            sendCandidateAddedEmail({ ...newCandidate, id: newDocRef.id });
          }
        }
    }
    setIsDialogOpen(false);
    setCurrentCandidate({});
  };
  
  const handleOpenDialog = (candidate?: Candidate) => {
    setIsEditing(!!candidate);
    setCurrentCandidate(candidate || {});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    const candidateDocRef = doc(firestore, 'candidates', id);
    deleteDocumentNonBlocking(candidateDocRef);
  };
  
  if (candidatesLoading || votesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Candidates</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {candidates?.map((candidate) => (
              <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onEdit={() => handleOpenDialog(candidate)} 
                  onDelete={() => handleDelete(candidate.id)}
                  voteCount={getVoteCount(candidate.id)}
              />
          ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentCandidate.name || ''} onChange={(e) => setCurrentCandidate({ ...currentCandidate, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="party" className="text-right">Party</Label>
              <Input id="party" value={currentCandidate.party || ''} onChange={(e) => setCurrentCandidate({ ...currentCandidate, party: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={currentCandidate.email || ''} onChange={(e) => setCurrentCandidate({ ...currentCandidate, email: e.target.value })} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input id="imageUrl" value={currentCandidate.imageUrl || ''} onChange={(e) => setCurrentCandidate({ ...currentCandidate, imageUrl: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manifesto" className="text-right">Manifesto</Label>
                <Input id="manifesto" value={currentCandidate.manifesto || ''} onChange={(e) => setCurrentCandidate({ ...currentCandidate, manifesto: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
