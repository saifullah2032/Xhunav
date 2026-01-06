'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint, KeyRound, Loader2, ShieldCheck, UserScan, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (step === 1) {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           setHasCameraPermission(false);
           console.error('Camera API not available.');
           return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions to verify your ID.',
          });
        }
      };
      getCameraPermission();
    } else {
       if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [step, toast]);


  const handleIdVerification = async () => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1500));
    toast({
      title: "ID Scan Successful",
      description: "Your identity has been verified against your voter registration.",
    });
    setIsLoading(false);
    setStep(2);
  };

  const handleBiometric = async () => {
    setIsLoading(true);
    // Simulate biometric scan
    await new Promise(res => setTimeout(res, 1500));
    toast({
      title: "Biometric Scan Successful",
      description: "Your fingerprint has been verified.",
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
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Voter Authentication</CardTitle>
              <CardDescription>Step 1: ID Card Verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-4 p-2 relative">
                    <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                       <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                       {hasCameraPermission === false && (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                               <Camera className="h-12 w-12 text-muted-foreground" />
                               <p className="text-sm text-muted-foreground mt-2">Camera not available</p>
                           </div>
                       )}
                    </div>
                    <p className="text-muted-foreground text-center text-sm">Please position your ID card within the frame.</p>
                </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser settings to complete ID verification.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleIdVerification} className="w-full" disabled={isLoading || !hasCameraPermission}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserScan className="mr-2 h-4 w-4" />}
                Verify ID
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Biometric Verification</CardTitle>
              <CardDescription>Step 2: Please scan your fingerprint to continue.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
              <div className="p-6 bg-primary/10 rounded-full">
                <Fingerprint className="h-20 w-20 text-primary" />
              </div>
              <p className="text-muted-foreground text-center">Place your finger on the scanner.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBiometric} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Scan Fingerprint
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
