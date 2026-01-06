import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { electionResults } from '@/lib/data';
import { Award } from 'lucide-react';

export default function LeadingCandidateCard() {
    const leadingCandidate = electionResults.candidateVotes.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
    const leadingParty = electionResults.partyVotes.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);

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
