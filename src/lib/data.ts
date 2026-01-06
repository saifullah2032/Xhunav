import { placeholderImages } from './placeholder-images';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  manifesto: string;
  imageUrl: string;
  votes: number; // For simulation purposes
}

export interface VoteTransaction {
  voterId: string; // Anonymized or Tokenized
  electionId: string;
  voteHash: string; // SHA-256
  signature: string; // CRYSTALS-Dilithium signature
  timestamp: number;
}

export type Voter = {
  id:string;
  name: string;
  voterId: string;
  email: string;
  idImageUrl: string;
};

export type Election = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Ended';
};

export const candidates: Candidate[] = [
  { id: '1', name: 'Aarav Sharma', party: 'Bharatiya Vikas Party', manifesto: 'Focus on economic growth and infrastructure.', imageUrl: placeholderImages[0].imageUrl, votes: 1200 },
  { id: '2', name: 'Saanvi Gupta', party: 'Jan Shakti Morcha', manifesto: 'Promoting social justice and equality.', imageUrl: placeholderImages[1].imageUrl, votes: 950 },
  { id: '3', name: 'Vivaan Singh', party: 'Loktantra Rakshak Dal', manifesto: 'Strengthening democratic institutions.', imageUrl: placeholderImages[2].imageUrl, votes: 1500 },
  { id: '4', name: 'Myra Reddy', party: 'Rashtriya Pragati Alliance', manifesto: 'Driving technological innovation.', imageUrl: placeholderImages[3].imageUrl, votes: 780 },
];

export const voters: Voter[] = [
  { id: '1', name: 'Aditi Kumar', voterId: 'VOTER-1001', email: 'aditi.kumar@example.com', idImageUrl: 'https://picsum.photos/seed/vid-1/400/400' },
  { id: '2', name: 'Rohan Joshi', voterId: 'VOTER-1002', email: 'rohan.joshi@example.com', idImageUrl: 'https://picsum.photos/seed/vid-2/400/400' },
  { id: '3', name: 'Priya Mehta', voterId: 'VOTER-1003', email: 'priya.mehta@example.com', idImageUrl: 'https://picsum.photos/seed/vid-3/400/400' },
  { id: '4', name: 'Kabir Desai', voterId: 'VOTER-1004', email: 'kabir.desai@example.com', idImageUrl: 'https://picsum.photos/seed/vid-4/400/400' },
  { id: '5', name: 'Ishaan Patel', voterId: 'VOTER-1005', email: 'ishaan.patel@example.com', idImageUrl: 'https://picsum.photos/seed/vid-5/400/400' },
];

export const elections: Election[] = [
  { id: '1', name: 'National Election 2024', startDate: '2024-10-01', endDate: '2024-10-05', status: 'Active' },
  { id: '2', name: 'State Assembly Election 2024', startDate: '2024-11-15', endDate: '2024-11-20', status: 'Upcoming' },
  { id: '3', name: 'Municipal Corporation Election 2023', startDate: '2023-12-01', endDate: '2023-12-03', status: 'Ended' },
];

const partyVotes = candidates.reduce((acc, candidate) => {
    acc[candidate.party] = (acc[candidate.party] || 0) + candidate.votes;
    return acc;
  }, {} as Record<string, number>);

export const electionResults = {
  totalVotes: candidates.reduce((acc, c) => acc + c.votes, 0),
  candidateVotes: candidates.map(c => ({ name: c.name, party: c.party, votes: c.votes })),
  partyVotes: Object.entries(partyVotes).map(([party, votes]) => ({ party, votes })),
};

export const transparencyData = {
    voteConfirmation: 0.95, // Vc: 95% of votes are confirmed on-chain
    ledgerAccessibility: 0.98, // La: Ledger is 98% accessible to public auditors
    publicTransparency: 0.88, // Pt: 88% of procedural data is publicly available
};
