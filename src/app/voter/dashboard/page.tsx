import ResultsChart from './results-chart';
import PartyResultsChart from './party-results-chart';
import LeadingCandidateCard from './leading-candidate-card';

export default function VoterDashboard() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Election Dashboard</h1>
      <div className="flex flex-1 gap-6">
        <div className="w-[61.8%]">
          <ResultsChart />
        </div>
        <div className="w-[38.2%] flex flex-col gap-6">
            <LeadingCandidateCard />
            <PartyResultsChart />
        </div>
      </div>
    </div>
  );
}
