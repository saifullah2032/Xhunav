import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Archive, UserCheck, Vote } from 'lucide-react';
import { elections, candidates, voters, electionResults } from '@/lib/data';
import ResultsChart from './results-chart';
import PartyResultsChart from './party-results-chart';

export default function VoterDashboard() {
  const activeElections = elections.filter(e => e.status === 'Active').length;

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Election Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionResults.totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all candidates</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResultsChart />
        <PartyResultsChart />
      </div>
    </div>
  );
}
