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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartConfig[entry.party]?.color} />
              ))}
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
