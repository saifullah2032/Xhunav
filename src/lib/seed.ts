
'use client';
import { collection, getDocs, writeBatch, doc, Firestore } from 'firebase/firestore';

const initialCandidates = [
    { id: "cand-1", name: "Aarav Sharma", party: "People's Justice Party", manifesto: "Focus on economic growth and job creation.", imageUrl: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njc1NjE3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", email: "aarav.sharma@example.com", idImageUrl: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njc1NjE3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "cand-2", name: "Saanvi Gupta", party: "National Progressive Front", manifesto: "Healthcare for all and environmental protection.", imageUrl: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NzY3NzY4NHww&ixlib=rb-4.1.0&q=80&w=1080", email: "saanvi.gupta@example.com", idImageUrl: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NzY3NzY4NHww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "cand-3", name: "Vivaan Singh", party: "Unity & Progress Alliance", manifesto: "Improving education and infrastructure.", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njc1NjE3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", email: "vivaan.singh@example.com", idImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3Njc1NjE3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "cand-4", name: "Myra Reddy", party: "Democratic Union Party", manifesto: "Digital innovation and transparent governance.", imageUrl: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NzY3NzY4NHww&ixlib=rb-4.1.0&q=80&w=1080", email: "myra.reddy@example.com", idImageUrl: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NzY3NzY4NHww&ixlib=rb-4.1.0&q=80&w=1080" },
];

const initialVoters = [
    { id: "voter-1", name: "Rohan Das", voterId: "VOT78921", email: "rohan.das@example.com", idImageUrl: "https://picsum.photos/seed/voter1/400/400" },
    { id: "voter-2", name: "Priya Sharma", voterId: "VOT55432", email: "priya.sharma@example.com", idImageUrl: "https://picsum.photos/seed/voter2/400/400" },
];

const initialElections = [
    { id: "elec-1", name: "National General Election 2024", region: "National", startDate: "2024-10-15", endDate: "2024-10-22", status: "Active", voterCount: 150000, candidateCount: 4 },
    { id: "elec-2", name: "State Assembly Election", region: "West", startDate: "2024-11-01", endDate: "2024-11-05", status: "Upcoming", voterCount: 25000, candidateCount: 12 },
];

const initialOfflineLocations = [
    { id: "loc-1", name: "Hillside Community Center", region: "North", officer: "Anjali Mehta", deviceStatus: "Online" },
    { id: "loc-2", name: "Riverside Town Hall", region: "South", officer: "Vikram Rathore", deviceStatus: "Offline" },
];

const initialVotes = [
  { candidateId: "cand-1", voterId: "anon-1", electionId: "elec-1", timestamp: Date.now() - 7200000 },
  { candidateId: "cand-2", voterId: "anon-2", electionId: "elec-1", timestamp: Date.now() - 7100000 },
  { candidateId: "cand-1", voterId: "anon-3", electionId: "elec-1", timestamp: Date.now() - 7000000 },
  { candidateId: "cand-4", voterId: "anon-4", electionId: "elec-1", timestamp: Date.now() - 6900000 },
  { candidateId: "cand-1", voterId: "anon-5", electionId: "elec-1", timestamp: Date.now() - 5200000 },
  { candidateId: "cand-3", voterId: "anon-6", electionId: "elec-1", timestamp: Date.now() - 5100000 },
  { candidateId: "cand-2", voterId: "anon-7", electionId: "elec-1", timestamp: Date.now() - 3600000 },
  { candidateId: "cand-2", voterId: "anon-8", electionId: "elec-1", timestamp: Date.now() - 3500000 },
  { candidateId: "cand-4", voterId: "anon-9", electionId: "elec-1", timestamp: Date.now() - 2200000 },
  { candidateId: "cand-1", voterId: "anon-10", electionId: "elec-1", timestamp: Date.now() - 1200000 },
];

async function seedCollection(firestore: Firestore, collectionName: string, data: any[]) {
    try {
        const collectionRef = collection(firestore, collectionName);
        const snapshot = await getDocs(collectionRef);
        if (snapshot.empty) {
            console.log(`Seeding ${collectionName}...`);
            const batch = writeBatch(firestore);
            data.forEach(item => {
                const { id, ...rest } = item;
                const docRef = doc(firestore, collectionName, id);
                batch.set(docRef, rest);
            });
            await batch.commit();
            console.log(`${collectionName} seeded successfully.`);
            return true;
        } else {
             console.log(`${collectionName} is not empty. Skipping seed.`);
        }
    } catch (error) {
        console.error(`Error seeding ${collectionName}:`, error);
    }
    return false;
}

export async function seedDatabase(firestore: Firestore) {
    const SEED_STATUS_KEY = 'firestore_seeded';
    const isSeeded = localStorage.getItem(SEED_STATUS_KEY);

    if (isSeeded) {
        return;
    }

    console.log("Starting database seed process...");

    await seedCollection(firestore, 'candidates', initialCandidates);
    await seedCollection(firestore, 'voters', initialVoters);
    await seedCollection(firestore, 'elections', initialElections);
    await seedCollection(firestore, 'offlineLocations', initialOfflineLocations);
    await seedCollection(firestore, 'votes', initialVotes);
    
    localStorage.setItem(SEED_STATUS_KEY, 'true');
    console.log("Database seed process completed.");
}
