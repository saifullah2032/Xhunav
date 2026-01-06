'use client';
import { useState } from 'react';
import Image from 'next/image';
import { candidates } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ShieldCheck, Vote } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function VoteForm() {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<(typeof candidates)[0] | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!selectedCandidate) return;

    setHasVoted(true);
    toast({
        title: "Vote Cast Successfully!",
        description: (
            <div className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <p>Your vote for {selectedCandidate.name} has been securely recorded on the blockchain using post-quantum cryptography.</p>
            </div>
        ),
        duration: 9000,
    });
  };

  if (hasVoted) {
    return (
        <Card className="text-center p-8 max-w-lg mx-auto">
            <ShieldCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Thank You for Voting!</CardTitle>
            <CardDescription>Your voice has been heard. Your vote is secure and counted.</CardDescription>
        </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="flex flex-col overflow-hidden">
          <CardHeader className="p-0">
            <div className="aspect-square relative w-full">
                <Image src={candidate.imageUrl} alt={candidate.name} fill className="object-cover" data-ai-hint={candidate.id === "2" || candidate.id === "4" ? "woman portrait" : "man portrait"}/>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <CardTitle>{candidate.name}</CardTitle>
            <CardDescription>{candidate.party}</CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full" onClick={() => setSelectedCandidate(candidate)}>
                        <Vote className="mr-2 h-4 w-4" /> Vote
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cast your vote for <span className="font-bold">{candidate.name}</span> of the {candidate.party}? This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVote}>Confirm Vote</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
