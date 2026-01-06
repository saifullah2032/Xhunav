import ResultsChart from './results-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VoterDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Election Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Voter!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Here you can see the live results of the ongoing election. When you are ready,
            proceed to the 'Vote' page to cast your ballot.
          </p>
        </CardContent>
      </Card>
      <ResultsChart />
    </div>
  );
}
