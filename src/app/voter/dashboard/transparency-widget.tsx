'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['hsl(var(--accent))', 'hsl(var(--muted))'];

export default function TransparencyIndexChart() {
    // Hardcoded value to remove dependency on the deleted `data.ts` file.
    const transparencyIndex = 92.7;

    const data = [
        { name: 'Index', value: transparencyIndex },
        { name: 'Remainder', value: 100 - transparencyIndex },
    ];
    const status = transparencyIndex > 85 ? "Highly Transparent" : "Sufficiently Transparent";


  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardHeader>
        <CardTitle>Transparency Index</CardTitle>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]}/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-foreground">{transparencyIndex.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
