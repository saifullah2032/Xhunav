'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { electionResults } from '@/lib/data';

const chartData = electionResults.candidateVotes;

const chartConfig = {
  votes: {
    label: 'Votes',
    color: 'hsl(var(--primary))',
  },
};

export default function ResultsChart() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Live Election Results</CardTitle>
        <CardDescription>National Election 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split(' ')[0]}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="votes" fill="var(--color-votes)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
