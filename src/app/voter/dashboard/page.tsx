import ResultsChart from './results-chart';
import PartyResultsChart from './party-results-chart';
import TransparencyWidget from './transparency-widget';
import LeadingCandidateCard from './leading-candidate-card';

export default function VoterDashboard() {
  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Election Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <TransparencyWidget />
             <LeadingCandidateCard />
          </div>
          <ResultsChart />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <PartyResultsChart />
        </div>
      </div>
    </div>
  );
}
