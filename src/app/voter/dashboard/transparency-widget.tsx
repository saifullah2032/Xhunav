'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { transparencyData } from '@/lib/data';

export default function TransparencyWidget() {
  const { voteConfirmation, ledgerAccessibility, publicTransparency } = transparencyData;
  const transparencyIndex = ((voteConfirmation + ledgerAccessibility + publicTransparency) / 3) * 100;
  const status = transparencyIndex > 85 ? "Highly Transparent" : "Sufficiently Transparent";

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="text-primary" />
          Transparency Index ($T_i$)
        </CardTitle>
        <CardDescription>Live measure of election integrity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold">{transparencyIndex.toFixed(1)}%</p>
          <div className={`flex items-center gap-2 font-semibold ${transparencyIndex > 85 ? 'text-green-600' : 'text-yellow-600'}`}>
            <CheckCircle2 />
            <span>{status}</span>
          </div>
        </div>
        <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                    <span>Vote Confirmation (Vc)</span>
                    <span>{(voteConfirmation * 100).toFixed(0)}%</span>
                </div>
                <Progress value={voteConfirmation * 100} className="h-1 mt-1" />
            </div>
             <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                    <span>Ledger Accessibility (La)</span>
                    <span>{(ledgerAccessibility * 100).toFixed(0)}%</span>
                </div>
                <Progress value={ledgerAccessibility * 100} className="h-1 mt-1" />
            </div>
             <div className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                    <span>Public Transparency (Pt)</span>
                    <span>{(publicTransparency * 100).toFixed(0)}%</span>
                </div>
                <Progress value={publicTransparency * 100} className="h-1 mt-1" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
