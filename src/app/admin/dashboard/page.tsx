import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, UserCheck, Archive, Vote, FileText } from 'lucide-react';
import { elections, candidates, voters, electionResults } from '@/lib/data';
import ResultsChart from '@/app/voter/dashboard/results-chart';
import PartyResultsChart from '@/app/voter/dashboard/party-results-chart';
import TransparencyWidget from '@/app/voter/dashboard/transparency-widget';
import LeadingCandidateCard from '@/app/voter/dashboard/leading-candidate-card';

function RecentLogs() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText />
          Recent Logs
        </CardTitle>
        <CardDescription>Live system and voting events</CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-2">
        <p>[timestamp] VOTE_CAST_SUCCESS: Voter [VoterID] cast a vote.</p>
        <p>[timestamp] AUTH_SUCCESS: Admin user logged in.</p>
        <p>[timestamp] VOTE_HASH_GENERATED: Vote hash created for transaction.</p>
      </CardContent>
    </Card>
  );
}


export default function AdminDashboard() {
  const activeElections = elections.filter(e => e.status === 'Active').length;

  return (
    <div className="p-6 h-[calc(100vh-8rem)] bg-background">
      <div className="grid grid-cols-12 grid-rows-3 gap-6 h-full font-body">
        
        {/* Zone A: Main Focus */}
        <div className="col-span-12 lg:col-span-8 row-span-2">
          <ResultsChart />
        </div>

        {/* Zone B: Secondary */}
        <div className="col-span-6 lg:col-span-4 row-span-1">
          <TransparencyWidget />
        </div>
        
        {/* Zone C: Tertiary */}
        <div className="col-span-6 lg:col-span-4 row-span-1">
          <PartyResultsChart />
        </div>
        
        {/* Zone D: Quaternary */}
        <div className="col-span-6 lg:col-span-4 row-span-1">
          <LeadingCandidateCard />
        </div>
        
        <div className="col-span-6 lg:col-span-4 row-span-1">
           <RecentLogs />
        </div>
      </div>
    </div>
  );
}
