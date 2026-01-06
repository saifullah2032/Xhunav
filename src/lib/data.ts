import { placeholderImages } from './placeholder-images';

export type Candidate = {
  id: string;
  name: string;
  party: string;
  imageUrl: string;
  votes: number;
};

export type Voter = {
  id: string;
  name: string;
  voterId: string;
};

export type Election = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Active' | 'Ended';
};

export const candidates: Candidate[] = [
  { id: '1', name: 'Aarav Sharma', party: 'Bharatiya Vikas Party', imageUrl: placeholderImages[0].imageUrl, votes: 1200 },
  { id: '2', name: 'Saanvi Gupta', party: 'Jan Shakti Morcha', imageUrl: placeholderImages[1].imageUrl, votes: 950 },
  { id: '3', name: 'Vivaan Singh', party: 'Loktantra Rakshak Dal', imageUrl: placeholderImages[2].imageUrl, votes: 1500 },
  { id: '4', name: 'Myra Reddy', party: 'Rashtriya Pragati Alliance', imageUrl: placeholderImages[3].imageUrl, votes: 780 },
];

export const voters: Voter[] = [
  { id: '1', name: 'Aditi Kumar', voterId: 'VOTER-1001' },
  { id: '2', name: 'Rohan Joshi', voterId: 'VOTER-1002' },
  { id: '3', name: 'Priya Mehta', voterId: 'VOTER-1003' },
  { id: '4', name: 'Kabir Desai', voterId: 'VOTER-1004' },
  { id: '5', name: 'Ishaan Patel', voterId: 'VOTER-1005' },
];

export const elections: Election[] = [
  { id: '1', name: 'National Election 2024', startDate: '2024-10-01', endDate: '2024-10-05', status: 'Active' },
  { id: '2', name: 'State Assembly Election 2024', startDate: '2024-11-15', endDate: '2024-11-20', status: 'Upcoming' },
  { id: '3', name: 'Municipal Corporation Election 2023', startDate: '2023-12-01', endDate: '2023-12-03', status: 'Ended' },
];

export const electionResults = {
  totalVotes: candidates.reduce((acc, c) => acc + c.votes, 0),
  candidateVotes: candidates.map(c => ({ name: c.name, party: c.party, votes: c.votes })),
};
