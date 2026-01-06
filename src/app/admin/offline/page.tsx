import OfflineLocationList from './offline-list';
import { offlineLocations } from '@/lib/data';

export default function OfflinePollingPage() {
  return <OfflineLocationList initialLocations={offlineLocations} />;
}
