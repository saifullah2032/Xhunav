'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Candidate } from '../candidates/candidate-list';
import { useMemo } from 'react';

interface Vote {
  candidateId: string;
}

export default function VotesPerCandidateChart() {
  const firestore = useFirestore();
  const candidatesRef = useMemoFirebase(() => collection(firestore, 'candidates'), [firestore]);
  const { data: candidates, isLoading: candidatesLoading } = useCollection<Candidate>(candidatesRef);
  const votesRef = useMemoFirebase(() => collection(firestore, 'votes'), [firestore]);
  const { data: votes, isLoading: votesLoading } = useCollection<Vote>(votesRef);

  const chartData = useMemo(() => {
    if (!candidates || !votes) return [];

    const voteCounts = candidates.map(candidate => {
      const count = votes.filter(vote => vote.candidateId === candidate.id).length;
      return { name: candidate.name, votes: count };
    });
    
    return voteCounts;
  }, [candidates, votes]);

  const isLoading = candidatesLoading || votesLoading;

  if (isLoading) {
      return <div>Loading...</div>
  }

  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardHeader>
        <CardTitle>Votes per Candidate</CardTitle>
        <CardDescription>Live count of votes for each candidate.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="name" tickFormatter={(value) => value.split(' ')[0]}/>
            <YAxis />
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
