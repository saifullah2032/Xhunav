import ResultsChart from './results-chart';
import PartyResultsChart from './party-results-chart';
import LeadingCandidateCard from './leading-candidate-card';

export default function VoterDashboard() {
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-6">
        <div className="w-[61.8%] flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight font-headline mb-6">Election Dashboard</h1>
            <div className="flex-grow">
                <ResultsChart />
            </div>
        </div>
        <div className="w-[38.2%] flex flex-col gap-6 pt-[4.5rem]">
            <LeadingCandidateCard />
            <PartyResultsChart />
        </div>
    </div>
  );
}
