import ResultsChart from './results-chart';
import PartyResultsChart from './party-results-chart';
import LeadingCandidateCard from './leading-candidate-card';

export default function VoterDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Election Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadingCandidateCard />
        <PartyResultsChart />
      </div>
      <ResultsChart />
    </div>
  );
}
