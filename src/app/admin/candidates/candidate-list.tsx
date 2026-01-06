'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Candidate } from '@/lib/data';
import { sendCandidateAddedEmail } from '@/lib/mail';

export default function CandidateList({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Partial<Candidate>>({});

  const handleSave = () => {
    if (!currentCandidate.name || !currentCandidate.party || !currentCandidate.email) {
        alert("Name, Party, and Email are required.");
        return;
    }

    if (isEditing) {
      setCandidates(candidates.map(c => c.id === currentCandidate.id ? { ...c, ...currentCandidate } as Candidate : c));
    } else {
      const newCandidate: Candidate = {
        id: (Date.now()).toString(),
        name: currentCandidate.name,
        party: currentCandidate.party,
        email: currentCandidate.email,
        manifesto: 'New candidate manifesto.',
        idImageUrl: currentCandidate.idImageUrl || 'https://picsum.photos/seed/id-' + Date.now() + '/400/400',
        imageUrl: 'https://picsum.photos/seed/' + Date.now() + '/400/400',
        votes: 0,
      };
      setCandidates([...candidates, newCandidate]);
      sendCandidateAddedEmail(newCandidate);
    }
    setIsDialogOpen(false);
  };
  
  const handleOpenDialog = (candidate?: Candidate) => {
    setIsEditing(!!candidate);
    setCurrentCandidate(candidate || {});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Candidates</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Candidate
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Image src={candidate.imageUrl} alt={candidate.name} width={40} height={40} className="rounded-full object-cover" />
                </TableCell>
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell>{candidate.party}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(candidate)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(candidate.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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
                <Label htmlFor="id-image" className="text-right">ID Image</Label>
                <Input id="id-image" type="file" className="col-span-3" />
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
