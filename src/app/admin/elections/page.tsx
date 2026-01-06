import { elections } from '@/lib/data';
import ElectionList from './election-list';

export default function ElectionsPage() {
  return <ElectionList initialElections={elections} />;
}
