'use client';
import { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { electionResults } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = electionResults.partyVotes;

export default function PartyResultsChart() {
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      votes: {
        label: 'Votes',
      },
    };
    chartData.forEach((party, index) => {
      config[party.party] = {
        label: party.party,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, []);

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
