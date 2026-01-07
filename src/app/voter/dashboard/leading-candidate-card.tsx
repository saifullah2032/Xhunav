'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Candidate } from '@/app/admin/candidates/candidate-list';
import { useMemo } from 'react';

interface Vote {
  candidateId: string;
}

export default function LeadingCandidateCard() {
    const firestore = useFirestore();
    const candidatesRef = useMemoFirebase(() => collection(firestore, 'candidates'), [firestore]);
    const { data: candidates, isLoading: candidatesLoading } = useCollection<Candidate>(candidatesRef);
    const votesRef = useMemoFirebase(() => collection(firestore, 'votes'), [firestore]);
    const { data: votes, isLoading: votesLoading } = useCollection<Vote>(votesRef);

    const { leadingCandidate, leadingParty } = useMemo(() => {
        if (!candidates || !votes) return { leadingCandidate: null, leadingParty: null };

        const voteCounts: { [id: string]: number } = {};
        votes.forEach(vote => {
            voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
        });
        
        let maxVotes = -1;
        let leading: Candidate | null = null;
        candidates.forEach(c => {
            if((voteCounts[c.id] || 0) > maxVotes) {
                maxVotes = voteCounts[c.id] || 0;
                leading = c;
            }
        });

        const partyVotes: { [party: string]: number } = {};
        candidates.forEach(c => {
            const partyVoteCount = voteCounts[c.id] || 0;
            partyVotes[c.party] = (partyVotes[c.party] || 0) + partyVoteCount;
        });

        let maxPartyVotes = -1;
        let leadingPartyName: string | null = null;
        Object.entries(partyVotes).forEach(([party, count]) => {
            if(count > maxPartyVotes) {
                maxPartyVotes = count;
                leadingPartyName = party;
            }
        });

        return {
            leadingCandidate: leading ? { ...leading, votes: maxVotes} : null,
            leadingParty: leadingPartyName ? { party: leadingPartyName, votes: maxPartyVotes } : null,
        }

    }, [candidates, votes]);

    const isLoading = candidatesLoading || votesLoading;

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!leadingCandidate || !leadingParty) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Currently in the Lead</CardTitle>
                    <CardDescription>Based on live vote counts</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>No votes cast yet.</p>
                </CardContent>
            </Card>
        )
    }


    return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-yellow-500" />
              Currently in the Lead
            </CardTitle>
            <CardDescription>Based on live vote counts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Leading Candidate</p>
              <div className="flex items-center gap-4 mt-1">
                  <div className="text-lg font-bold">{leadingCandidate.name}</div>
                  <div className="text-sm text-muted-foreground">{leadingCandidate.party}</div>
              </div>
              <p className="text-2xl font-bold text-primary">{leadingCandidate.votes.toLocaleString()} votes</p>
            </div>
             <div>
              <p className="text-sm font-medium text-muted-foreground">Leading Party</p>
              <div className="flex items-center gap-4 mt-1">
                  <div className="text-lg font-bold">{leadingParty.party}</div>
              </div>
              <p className="text-2xl font-bold text-primary">{leadingParty.votes.toLocaleString()} total votes</p>
            </div>
          </CardContent>
        </Card>
      );
}
