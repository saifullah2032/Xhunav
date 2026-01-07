
'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';

interface Vote {
  timestamp: number;
}

export default function RealTimeVoteTally() {
  const firestore = useFirestore();
  const votesQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'votes'), orderBy('timestamp', 'asc')) : null,
    [firestore]
  );
  const { data: votes, isLoading } = useCollection<Vote>(votesQuery);

  const chartData = useMemo(() => {
    if (!votes) return [];
    
    // Group votes by hour
    const hourlyVotes: {[key: string]: number} = {};
    let cumulativeVotes = 0;
    const dataPoints: { time: string, votes: number }[] = [];
    
    if (votes.length === 0) return [];

    const firstVoteTime = new Date(votes[0].timestamp);
    let currentTimeBin = new Date(firstVoteTime);
    currentTimeBin.setMinutes(0, 0, 0);

    votes.forEach(vote => {
      const voteTime = new Date(vote.timestamp);
      
      while (voteTime > new Date(currentTimeBin.getTime() + 3600000)) {
        const time = `${currentTimeBin.getHours()}:00`;
        dataPoints.push({ time, votes: cumulativeVotes });
        currentTimeBin = new Date(currentTimeBin.getTime() + 3600000);
      }

      cumulativeVotes++;
    });

    // Add the last bin
    const time = `${currentTimeBin.getHours()}:00`;
    dataPoints.push({ time, votes: cumulativeVotes });


    return dataPoints.map(p => ({...p, votes: p.votes}));


  }, [votes]);

  if (isLoading) {
      return <div>Loading chart...</div>
  }

  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardHeader>
        <CardTitle>Real-Time Vote Tally</CardTitle>
        <CardDescription>Votes received over time across all polling stations.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Area type="monotone" dataKey="votes" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorVotes)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
