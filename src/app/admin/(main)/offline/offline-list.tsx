
'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { seedDatabase } from '@/lib/seed';


export type OfflineLocation = {
    id: string;
    name: string;
    region: string;
    officer: string;
    deviceStatus: 'Online' | 'Offline' | 'Syncing';
};

export default function OfflineLocationList() {
    const firestore = useFirestore();
    
    useEffect(() => {
        if (firestore) {
          seedDatabase(firestore);
        }
    }, [firestore]);

    const locationsRef = useMemoFirebase(() => firestore ? collection(firestore, 'offlineLocations'): null, [firestore]);
    const { data: locations, isLoading } = useCollection<OfflineLocation>(locationsRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Partial<OfflineLocation>>({});

  const handleSave = () => {
    if (!firestore) return;
    if (!currentLocation.name || !currentLocation.region || !currentLocation.officer || !currentLocation.deviceStatus) {
        alert("All fields are required.");
        return;
    }

    if (isEditing && currentLocation.id) {
        const locationDocRef = doc(firestore, 'offlineLocations', currentLocation.id);
        updateDocumentNonBlocking(locationDocRef, currentLocation);
    } else {
      const newLocation: Omit<OfflineLocation, 'id'> = {
        name: currentLocation.name,
        region: currentLocation.region,
        officer: currentLocation.officer,
        deviceStatus: currentLocation.deviceStatus as OfflineLocation['deviceStatus'],
      };
      if (locationsRef) {
        addDocumentNonBlocking(locationsRef, newLocation);
      }
    }
    setIsDialogOpen(false);
    setCurrentLocation({});
  };

  const handleOpenDialog = (location?: OfflineLocation) => {
    setIsEditing(!!location);
    setCurrentLocation(location || { deviceStatus: 'Offline' });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (!firestore) return;
    const locationDocRef = doc(firestore, 'offlineLocations', id);
    deleteDocumentNonBlocking(locationDocRef);
  };
  
  const getStatusVariant = (status: OfflineLocation['deviceStatus']) => {
    switch (status) {
      case 'Online': return 'default';
      case 'Offline': return 'destructive';
      case 'Syncing': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
      return <div>Loading...</div>
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Offline Polling Stations</h1>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Assigned Officer</TableHead>
              <TableHead>Device Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations?.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.region}</TableCell>
                <TableCell>{location.officer}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(location.deviceStatus)}>{location.deviceStatus}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(location)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(location.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={currentLocation.name || ''} onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">Region</Label>
              <Input id="region" value={currentLocation.region || ''} onChange={(e) => setCurrentLocation({ ...currentLocation, region: e.target.value })} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="officer" className="text-right">Officer</Label>
              <Input id="officer" value={currentLocation.officer || ''} onChange={(e) => setCurrentLocation({ ...currentLocation, officer: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Device Status</Label>
              <Select value={currentLocation.deviceStatus} onValueChange={(value: OfflineLocation['deviceStatus']) => setCurrentLocation({ ...currentLocation, deviceStatus: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Syncing">Syncing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
