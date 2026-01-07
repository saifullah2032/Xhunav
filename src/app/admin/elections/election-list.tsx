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
import { sendElectionWinnerEmail, sendElectionResultsEmail } from '@/lib/mail';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Candidate } from '../candidates/candidate-list';
import type { Voter } from '../voters/voter-list';

export type Election = {
  id: string;
  name: string;
  region: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Ended';
  voterCount: number;
  candidateCount: number;
};

export default function ElectionList() {
  const firestore = useFirestore();
  const electionsRef = useMemoFirebase(() => collection(firestore, 'elections'), [firestore]);
  const { data: elections, isLoading: electionsLoading } = useCollection<Election>(electionsRef);
  
  const candidatesRef = useMemoFirebase(() => collection(firestore, 'candidates'), [firestore]);
  const { data: candidates, isLoading: candidatesLoading } = useCollection<Candidate>(candidatesRef);

  const votersRef = useMemoFirebase(() => collection(firestore, 'voters'), [firestore]);
  const { data: voters, isLoading: votersLoading } = useCollection<Voter>(votersRef);
  
  const votesRef = useMemoFirebase(() => collection(firestore, 'votes'), [firestore]);
  const { data: votes, isLoading: votesLoading } = useCollection<{candidateId: string}>(votesRef);


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentElection, setCurrentElection] = useState<Partial<Election>>({});
  
  const getVoteCounts = () => {
    if (!votes || !candidates) return {};
    const counts: {[key: string]: number} = {};
    candidates.forEach(c => counts[c.id] = 0);
    votes.forEach(v => {
      if (counts[v.candidateId] !== undefined) {
        counts[v.candidateId]++;
      }
    });
    return counts;
  }

  const handleElectionEnd = (election: Election) => {
    if(!candidates || !votes || !voters) return;

    const voteCounts = getVoteCounts();
    
    let winner: Candidate | null = null;
    let maxVotes = -1;

    candidates.forEach(candidate => {
        const count = voteCounts[candidate.id] || 0;
        if(count > maxVotes) {
            maxVotes = count;
            winner = candidate;
        }
    });
    
    if (winner) {
        sendElectionWinnerEmail(winner);

        const allRecipients = [...candidates, ...voters];
        sendElectionResultsEmail(allRecipients, winner, election, maxVotes);
    }
    
  };

  const handleSave = () => {
    if (!currentElection.name || !currentElection.startDate || !currentElection.endDate || !currentElection.status || !currentElection.region) {
        alert("All fields are required.");
        return;
    }
    
    const originalElection = isEditing ? elections?.find(e => e.id === currentElection.id) : undefined;

    if (isEditing && currentElection.id) {
        const electionDocRef = doc(firestore, 'elections', currentElection.id);
        updateDocumentNonBlocking(electionDocRef, currentElection);
    } else {
      const newElection: Omit<Election, 'id'> = {
        name: currentElection.name,
        startDate: currentElection.startDate,
        endDate: currentElection.endDate,
        status: currentElection.status as Election['status'],
        region: currentElection.region,
        voterCount: currentElection.voterCount || 0,
        candidateCount: currentElection.candidateCount || 0,
      };
      addDocumentNonBlocking(electionsRef, newElection);
    }

    if (currentElection.status === 'Ended' && originalElection?.status !== 'Ended') {
        handleElectionEnd(currentElection as Election);
    }

    setIsDialogOpen(false);
    setCurrentElection({});
  };

  const handleOpenDialog = (election?: Election) => {
    setIsEditing(!!election);
    setCurrentElection(election || { status: 'Upcoming' });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    const electionDocRef = doc(firestore, 'elections', id);
    deleteDocumentNonBlocking(electionDocRef);
  };
  
  const getStatusVariant = (status: Election['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Ended': return 'destructive';
      case 'Upcoming': return 'secondary';
      default: return 'outline';
    }
  };
  
  const isLoading = electionsLoading || candidatesLoading || votersLoading || votesLoading;

  if (isLoading) {
    return <div>Loading...</div>
  }

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
              <TableHead>Region</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Voters</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {elections?.map((election) => (
              <TableRow key={election.id}>
                <TableCell className="font-medium">{election.name}</TableCell>
                <TableCell>{election.region}</TableCell>
                <TableCell>{election.startDate}</TableCell>
                <TableCell>{election.endDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(election.status)}>{election.status}</Badge>
                </TableCell>
                <TableCell>{election.voterCount}</TableCell>
                <TableCell>{election.candidateCount}</TableCell>
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
              <Label htmlFor="region" className="text-right">Region</Label>
              <Input id="region" value={currentElection.region || ''} onChange={(e) => setCurrentElection({ ...currentElection, region: e.target.value })} className="col-span-3" />
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
              <Label htmlFor="voterCount" className="text-right">Voter Count</Label>
              <Input type="number" id="voterCount" value={currentElection.voterCount || ''} onChange={(e) => setCurrentElection({ ...currentElection, voterCount: Number(e.target.value) })} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="candidateCount" className="text-right">Candidate Count</Label>
              <Input type="number" id="candidateCount" value={currentElection.candidateCount || ''} onChange={(e) => setCurrentElection({ ...currentElection, candidateCount: Number(e.target.value) })} className="col-span-3" />
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
