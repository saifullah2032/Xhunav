'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Election, Candidate, Voter } from '@/lib/data';
import { candidates, voters } from '@/lib/data';
import { sendElectionWinnerEmail, sendElectionResultsEmail } from '@/lib/mail';

export default function ElectionList({ initialElections }: { initialElections: Election[] }) {
  const [elections, setElections] = useState(initialElections);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentElection, setCurrentElection] = useState<Partial<Election>>({});

  const handleElectionEnd = (election: Election) => {
    // This is a simulation. In a real app, you'd fetch live results.
    const winner = candidates.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
    
    // Send email to winner
    sendElectionWinnerEmail(winner);

    // Send email to all candidates and voters
    const allCandidatesAndVoters: (Candidate | Voter)[] = [...candidates, ...voters];
    sendElectionResultsEmail(allCandidatesAndVoters, winner, election);
  };

  const handleSave = () => {
    if (!currentElection.name || !currentElection.startDate || !currentElection.endDate || !currentElection.status) {
        alert("All fields are required.");
        return;
    }

    if (isEditing) {
      const updatedElections = elections.map(e => e.id === currentElection.id ? { ...e, ...currentElection } as Election : e);
      setElections(updatedElections);
      
      const updatedElection = updatedElections.find(e => e.id === currentElection.id);
      if (updatedElection && updatedElection.status === 'Ended') {
        const originalElection = elections.find(e => e.id === currentElection.id);
        if (originalElection && originalElection.status !== 'Ended') {
            handleElectionEnd(updatedElection);
        }
      }
    } else {
      const newElection: Election = {
        id: (Date.now()).toString(),
        name: currentElection.name,
        startDate: currentElection.startDate,
        endDate: currentElection.endDate,
        status: currentElection.status,
      };
      setElections([...elections, newElection]);
       if (newElection.status === 'Ended') {
        handleElectionEnd(newElection);
      }
    }
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (election?: Election) => {
    setIsEditing(!!election);
    setCurrentElection(election || { status: 'Upcoming' });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setElections(elections.filter(e => e.id !== id));
  };
  
  const getStatusVariant = (status: Election['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Ended': return 'destructive';
      case 'Upcoming': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Elections</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Election
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {elections.map((election) => (
              <TableRow key={election.id}>
                <TableCell className="font-medium">{election.name}</TableCell>
                <TableCell>{election.startDate}</TableCell>
                <TableCell>{election.endDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(election.status)}>{election.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(election)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(election.id)}>
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
            <DialogTitle>{isEditing ? 'Edit Election' : 'Create New Election'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentElection.name || ''} onChange={(e) => setCurrentElection({ ...currentElection, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Start Date</Label>
              <Input type="date" id="startDate" value={currentElection.startDate || ''} onChange={(e) => setCurrentElection({ ...currentElection, startDate: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">End Date</Label>
              <Input type="date" id="endDate" value={currentElection.endDate || ''} onChange={(e) => setCurrentElection({ ...currentElection, endDate: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select value={currentElection.status} onValueChange={(value: Election['status']) => setCurrentElection({ ...currentElection, status: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Ended">Ended</SelectItem>
                </SelectContent>
              </Select>
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
