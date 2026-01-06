'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { electionResults } from '@/lib/data';

const chartData = electionResults.partyVotes;

const chartConfig = {
  votes: {
    label: 'Votes',
  },
  'Bharatiya Vikas Party': {
    label: 'Bharatiya Vikas Party',
    color: 'hsl(var(--chart-1))',
  },
  'Jan Shakti Morcha': {
    label: 'Jan Shakti Morcha',
    color: 'hsl(var(--chart-2))',
  },
  'Loktantra Rakshak Dal': {
    label: 'Loktantra Rakshak Dal',
    color: 'hsl(var(--chart-3))',
  },
  'Rashtriya Pragati Alliance': {
    label: 'Rashtriya Pragati Alliance',
    color: 'hsl(var(--chart-4))',
  },
};

export default function PartyResultsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Party Standings</CardTitle>
        <CardDescription>Total votes by party</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full max-w-[250px]">
          <PieChart accessibilityLayer>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="party"
              innerRadius={60}
              strokeWidth={5}
            >
            </Pie>
            <ChartLegend
                content={<ChartLegendContent nameKey="party" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
