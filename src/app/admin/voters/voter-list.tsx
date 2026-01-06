'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Voter } from '@/lib/data';

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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Voter ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voters.map((voter) => (
              <TableRow key={voter.id}>
                <TableCell className="font-medium">{voter.name}</TableCell>
                <TableCell>{voter.voterId}</TableCell>
                <TableCell>{voter.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(voter)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(voter.id)}>
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
