'use client';
import { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Candidate } from '@/app/admin/candidates/candidate-list';

interface Vote {
  candidateId: string;
}

export default function PartyResultsChart() {
  const firestore = useFirestore();
  const candidatesRef = useMemoFirebase(() => collection(firestore, 'candidates'), [firestore]);
  const { data: candidates, isLoading: candidatesLoading } = useCollection<Candidate>(candidatesRef);
  const votesRef = useMemoFirebase(() => collection(firestore, 'votes'), [firestore]);
  const { data: votes, isLoading: votesLoading } = useCollection<Vote>(votesRef);

  const { chartData, chartConfig } = useMemo(() => {
    if (!candidates || !votes) return { chartData: [], chartConfig: {} };

    const partyVotes: { [party: string]: number } = {};
     const voteCounts: { [id: string]: number } = {};
    votes.forEach(vote => {
        voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
    });

    candidates.forEach(c => {
        const partyVoteCount = voteCounts[c.id] || 0;
        partyVotes[c.party] = (partyVotes[c.party] || 0) + partyVoteCount;
    });

    const data = Object.entries(partyVotes).map(([party, votes]) => ({ party, votes }));
    
    const config: ChartConfig = {
      votes: {
        label: 'Votes',
      },
    };
    data.forEach((party, index) => {
      config[party.party] = {
        label: party.party,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return { chartData: data, chartConfig: config };

  }, [candidates, votes]);

  const isLoading = candidatesLoading || votesLoading;

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Party Standings</CardTitle>
        <CardDescription>Total votes by party</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer config={chartConfig} className="w-full h-full min-h-0">
          <PieChart accessibilityLayer>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="party"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              label={({ percent, name }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.party}`} fill={chartConfig[entry.party]?.color} />
              ))}
            </Pie>
            <ChartLegend
                content={<ChartLegendContent nameKey="party" />}
                className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
