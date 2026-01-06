import { voters } from '@/lib/data';
import VoterList from './voter-list';

export default function VotersPage() {
  return <VoterList initialVoters={voters} />;
}
