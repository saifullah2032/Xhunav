
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ShieldCheck, AlertTriangle } from 'lucide-react';
import RealTimeVoteTally from './real-time-vote-tally';
import TransparencyIndexChart from './transparency-index-chart';
import VotesPerCandidateChart from './votes-per-candidate-chart';
import VoterTurnoutChart from './voter-turnout-chart';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Voter } from '../voters/voter-list';
import { useEffect } from 'react';
import { seedDatabase } from '@/lib/seed';


function StatCard({ title, value, icon: Icon, subtext }: { title: string, value: string, icon: React.ElementType, subtext: string }) {
  return (
    <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const firestore = useFirestore();

  useEffect(() => {
    if (firestore) {
      seedDatabase(firestore);
    }
  }, [firestore]);
  
  const votersRef = useMemoFirebase(() => firestore ? collection(firestore, 'voters') : null, [firestore]);
  const { data: voters, isLoading } = useCollection<Voter>(votersRef);

  if (isLoading) {
    return <div>Loading Dashboard...</div>
  }

  return (
    <div className="grid grid-cols-12 gap-6 font-body">
      {/* Zone A: Real-Time Vote Tally */}
      <div className="col-span-12 lg:col-span-8">
        <RealTimeVoteTally />
      </div>

      {/* Zone B: Transparency Index */}
      <div className="col-span-12 lg:col-span-4">
        <TransparencyIndexChart />
      </div>

      {/* Bottom Row */}
      {/* Col 1: Votes per Candidate */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <VotesPerCandidateChart />
      </div>

      {/* Col 2: Voter Turnout by Region */}
      <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <VoterTurnoutChart />
      </div>

      {/* Col 3: Stacked Small Cards */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
           <StatCard title="Total Voters" value={(voters?.length || 0).toLocaleString()} icon={Users} subtext="Registered" />
           <StatCard title="Active Nodes" value="1,204" icon={ShieldCheck} subtext="Blockchain Network" />
        </div>
        <Card className="bg-white rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                     Rejected Votes
                </CardTitle>
                <CardDescription>Security Alerts</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-accent">42</p>
                <p className="text-xs text-muted-foreground">Potential duplicate or invalid signatures detected.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
