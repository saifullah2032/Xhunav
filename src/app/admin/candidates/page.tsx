import { candidates } from '@/lib/data';
import CandidateList from './candidate-list';

export default function CandidatesPage() {
  return <CandidateList initialCandidates={candidates} />;
}
