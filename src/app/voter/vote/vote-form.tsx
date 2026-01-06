'use client';
import { useState } from 'react';
import Image from 'next/image';
import { candidates } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ShieldCheck, Vote, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import type { Candidate } from '@/lib/data';

// Faking a cryptographic library
const fakeCrypto = {
    sha256: async (message: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    dilithiumSign: async (hash: string) => {
        // This is a simulation of a time-consuming cryptographic operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `dilithium-signed(${hash.substring(0, 20)}...)`;
    }
};

export default function VoteForm() {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleVote = async () => {
    if (!selectedCandidate) return;

    setIsSigning(true);

    try {
        const voteData = {
            voterId: "voter-token-xyz", // This would be a real, anonymized token
            electionId: "national-2024",
            candidateId: selectedCandidate.id,
            timestamp: Date.now(),
        };

        const voteString = JSON.stringify(voteData);
        const voteHash = await fakeCrypto.sha256(voteString);
        const signature = await fakeCrypto.dilithiumSign(voteHash);

        const voteTransaction = {
            voterId: voteData.voterId,
            electionId: voteData.electionId,
            voteHash: voteHash,
            signature: signature,
            timestamp: voteData.timestamp,
        };

        // In a real app, you would send `voteTransaction` to Firestore
        console.log("Vote Transaction Payload:", voteTransaction);

        setHasVoted(true);
        toast({
            title: "Vote Cast and Secured!",
            description: (
                <div className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <p>Your vote has been signed with CRYSTALS-Dilithium and recorded on the blockchain.</p>
                </div>
            ),
            duration: 9000,
        });

    } catch (error) {
        console.error("Failed to sign or cast vote:", error);
        toast({
            variant: "destructive",
            title: "Voting Failed",
            description: "Could not securely sign your vote. Please try again.",
        });
    } finally {
        setIsSigning(false);
    }
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
        <Card key={candidate.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="p-0">
            <div className="aspect-square relative w-full">
                <Image src={candidate.imageUrl} alt={candidate.name} fill className="object-cover" data-ai-hint="portrait" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <CardTitle>{candidate.name}</CardTitle>
            <CardDescription>{candidate.party}</CardDescription>
            <p className="text-sm text-muted-foreground mt-2">{candidate.manifesto}</p>
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
                        You are about to cast a vote for <span className="font-bold">{candidate.name}</span>. This action is secured by post-quantum cryptography and is irreversible.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVote} disabled={isSigning}>
                        {isSigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Confirm & Sign Vote
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
