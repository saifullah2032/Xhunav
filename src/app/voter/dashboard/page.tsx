import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Archive, Vote, ArrowUp, ArrowDown } from 'lucide-react';
import { elections, candidates, voters, electionResults } from '@/lib/data';
import ResultsChart from './results-chart';
import PartyResultsChart from './party-results-chart';
import { Progress } from '@/components/ui/progress';

export default function VoterDashboard() {
  const activeElections = elections.filter(e => e.status === 'Active').length;

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Election Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="p-3 bg-blue-100 rounded-md">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                <ArrowUp className="h-4 w-4" /> 2.1%
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total Voters</p>
            <div className="text-2xl font-bold">{voters.length.toLocaleString()}</div>
            <Progress value={75} className="h-1 mt-2 bg-blue-100" indicatorClassName="bg-blue-500" />
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="p-3 bg-green-100 rounded-md">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                <ArrowUp className="h-4 w-4" /> 5.2%
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total Candidates</p>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <Progress value={60} className="h-1 mt-2 bg-green-100" indicatorClassName="bg-green-500" />
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="p-3 bg-yellow-100 rounded-md">
                <Archive className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                <ArrowDown className="h-4 w-4" /> 1.5%
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active Elections</p>
            <div className="text-2xl font-bold">{activeElections}</div>
            <Progress value={40} className="h-1 mt-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
          </CardContent>
        </Card>
         <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="p-3 bg-indigo-100 rounded-md">
                <Vote className="h-4 w-4 text-indigo-500" />
            </div>
             <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                <ArrowUp className="h-4 w-4" /> 12.8%
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total Votes Cast</p>
            <div className="text-2xl font-bold">{electionResults.totalVotes.toLocaleString()}</div>
            <Progress value={85} className="h-1 mt-2 bg-indigo-100" indicatorClassName="bg-indigo-500" />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-5 gap-4 flex-1">
        <div className="col-span-3">
          <ResultsChart />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <PartyResultsChart />
        </div>
      </div>
    </div>
  );
}
