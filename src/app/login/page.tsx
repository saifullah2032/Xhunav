'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint, KeyRound, Loader2, ShieldCheck, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Firebase Auth login
    await new Promise(res => setTimeout(res, 1000));
    setIsLoading(false);
    setStep(2);
  };

  const handleBiometric = async () => {
    setIsLoading(true);
    // Simulate biometric scan
    await new Promise(res => setTimeout(res, 1500));
    toast({
      title: "Biometric Scan Successful",
      description: "Your identity has been verified.",
    });
    setIsLoading(false);
    setStep(3);
  };
  
  const handlePrivateKey = async () => {
    setIsLoading(true);
    // Simulate private key validation
    await new Promise(res => setTimeout(res, 1000));
    toast({
      title: "Authentication Complete",
      description: "You are now securely logged in.",
      className: "bg-green-500 text-white",
    });
    setIsLoading(false);
    router.push('/voter/dashboard');
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        {step === 1 && (
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-2xl">Voter Authentication</CardTitle>
              <CardDescription>Step 1: Log in with your credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="voter@example.com" required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" required className="pl-10"/>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Biometric Verification</CardTitle>
              <CardDescription>Step 2: Please scan your fingerprint or face to continue.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
              <div className="p-6 bg-primary/10 rounded-full">
                <Fingerprint className="h-20 w-20 text-primary" />
              </div>
              <p className="text-muted-foreground text-center">Place your finger on the scanner or look at the camera.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBiometric} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Scan Now
              </Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
            <>
            <CardHeader>
              <CardTitle className="text-2xl">Private Key Confirmation</CardTitle>
              <CardDescription>Step 3: Confirm access to your quantum-resistant private key.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
                <div className="p-6 bg-green-500/10 rounded-full">
                   <ShieldCheck className="h-20 w-20 text-green-500" />
                </div>
                <p className="text-muted-foreground text-center">Your secure key will be used to sign your vote.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePrivateKey} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Access Key & Enter
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
