'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

interface Vote {
  timestamp: number;
}

export default function RealTimeVoteTally() {
  const firestore = useFirestore();
  const votesRef = useMemoFirebase(() => collection(firestore, 'votes'), [firestore]);
  const { data: votes, isLoading } = useCollection<Vote>(votesRef);

  const chartData = useMemo(() => {
    if (!votes) return [];
    
    const hourlyVotes: {[key: string]: number} = {};
    votes.forEach(vote => {
      const date = new Date(vote.timestamp);
      const hour = date.getHours();
      const time = `${hour}:00`;
      if (!hourlyVotes[time]) {
        hourlyVotes[time] = 0;
      }
      hourlyVotes[time]++;
    });

    const sortedHours = Object.keys(hourlyVotes).sort((a,b) => parseInt(a) - parseInt(b));
    
    let cumulativeVotes = 0;
    return sortedHours.map(time => {
        cumulativeVotes += hourlyVotes[time];
        return { time, votes: cumulativeVotes };
    });

  }, [votes]);

  if (isLoading) {
      return <div>Loading chart...</div>
  }

  return (
    <Card className="rounded-2xl shadow-sm h-full col-span-2">
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
            <YAxis />
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
