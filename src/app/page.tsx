import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--background)),transparent)]"></div>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-4">
            <Vote className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Xhunav E-Vote</CardTitle>
          <CardDescription>
            Stimulation of e-voting through blockchain and post-quantum cryptography.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/voter/dashboard" className="w-full">
            <Button className="w-full" size="lg">Voter Login</Button>
          </Link>
          <Link href="/admin/dashboard" className="w-full">
            <Button className="w-full" variant="secondary" size="lg">Admin Login</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
