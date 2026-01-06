'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Voter } from '@/lib/data';
import { sendVoterAddedEmail } from '@/lib/mail';

function VoterCard({ voter, onEdit, onDelete }: { voter: Voter, onEdit: () => void, onDelete: () => void }) {
  return (
    <Card className="group relative flex flex-col overflow-hidden text-center transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 bg-primary [clip-path:polygon(0_0,_100%_0,_100%_80%,_0_100%)]">
          <Image 
            src={voter.idImageUrl} 
            alt={voter.name} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center p-6">
        <CardContent className="p-0 flex-grow">
          <h3 className="text-lg font-bold">{voter.name}</h3>
          <p className="text-sm text-muted-foreground">{voter.voterId}</p>
          <p className="text-xs text-muted-foreground">{voter.email}</p>
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

export default function VoterList({ initialVoters }: { initialVoters: Voter[] }) {
  const [voters, setVoters] = useState(initialVoters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoter, setCurrentVoter] = useState<Partial<Voter>>({});

  const handleSave = () => {
    if (!currentVoter.name || !currentVoter.voterId || !currentVoter.email) {
        alert("Name, Voter ID, and Email are required.");
        return;
    }

    if (isEditing) {
      setVoters(voters.map(v => v.id === currentVoter.id ? { ...v, ...currentVoter } as Voter : v));
    } else {
      const newVoter: Voter = {
        id: (Date.now()).toString(),
        name: currentVoter.name,
        voterId: currentVoter.voterId,
        email: currentVoter.email,
        idImageUrl: currentVoter.idImageUrl || 'https://picsum.photos/seed/id-' + Date.now() + '/400/400',
      };
      setVoters([...voters, newVoter]);
      sendVoterAddedEmail(newVoter);
    }
    setIsDialogOpen(false);
  };
  
  const handleOpenDialog = (voter?: Voter) => {
    setIsEditing(!!voter);
    setCurrentVoter(voter || {});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVoters(voters.filter(v => v.id !== id));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Voters</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Voter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {voters.map((voter) => (
          <VoterCard 
            key={voter.id} 
            voter={voter} 
            onEdit={() => handleOpenDialog(voter)}
            onDelete={() => handleDelete(voter.id)}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Voter' : 'Add New Voter'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentVoter.name || ''} onChange={(e) => setCurrentVoter({ ...currentVoter, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voterId" className="text-right">Voter ID</Label>
              <Input id="voterId" value={currentVoter.voterId || ''} onChange={(e) => setCurrentVoter({ ...currentVoter, voterId: e.target.value })} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={currentVoter.email || ''} onChange={(e) => setCurrentVoter({ ...currentVoter, email: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="idImageUrl" className="text-right">ID Image URL</Label>
                <Input id="idImageUrl" value={currentVoter.idImageUrl || ''} onChange={(e) => setCurrentVoter({ ...currentVoter, idImageUrl: e.target.value })} className="col-span-3" />
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
