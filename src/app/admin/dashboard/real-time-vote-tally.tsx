'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { time: '10:00', votes: 200 },
  { time: '11:00', votes: 450 },
  { time: '12:00', votes: 600 },
  { time: '13:00', votes: 1200 },
  { time: '14:00', votes: 1800 },
  { time: '15:00', votes: 2100 },
  { time: '16:00', votes: 3430 },
];

export default function RealTimeVoteTally() {
  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardHeader>
        <CardTitle>Real-Time Vote Tally</CardTitle>
        <CardDescription>Votes received over time across all polling stations.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
