import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Archive, UserCheck } from 'lucide-react';
import { elections, candidates, voters } from '@/lib/data';
import ResultsChart from '@/app/voter/dashboard/results-chart';
import PartyResultsChart from '@/app/voter/dashboard/party-results-chart';
import LeadingCandidateCard from '@/app/voter/dashboard/leading-candidate-card';

export default function AdminDashboard() {
  const activeElections = elections.filter(e => e.status === 'Active').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voters.length}</div>
            <p className="text-xs text-muted-foreground">Registered voters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <p className="text-xs text-muted-foreground">Candidates for election</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeElections}</div>
            <p className="text-xs text-muted-foreground">Currently running elections</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadingCandidateCard />
        <PartyResultsChart />
      </div>
      <ResultsChart />
    </div>
  );
}
