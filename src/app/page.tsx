
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, ShieldCheck, GitBranch, ListChecks } from 'lucide-react';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Vote className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold font-headline">Xhunav</span>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-muted py-6 px-4 md:px-6 mt-12">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; 2024 Xhunav. All rights reserved.</p>
        <p className="mt-1">A secure e-voting platform stimulation.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative flex min-h-screen flex-col items-center justify-center p-4 pt-16">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--background)),transparent)]"></div>
          </div>
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-4">
                <Vote className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold font-headline">Xhunav</CardTitle>
              <CardDescription>
                Stimulation of e-voting through blockchain and post-quantum cryptography.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/login" className="w-full">
                  Voter Login
                </Link>
              </Button>
              <Button asChild className="w-full" variant="secondary" size="lg">
                <Link href="/admin/login">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="about" className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">A New Era of Digital Democracy</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our platform combines cutting-edge security with unparalleled transparency to create an e-voting system you can trust.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Quantum-Resistant</h3>
                <p className="mt-2 text-muted-foreground">
                  Utilizing CRYSTALS-Dilithium for post-quantum digital signatures, safeguarding votes against future threats.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <GitBranch className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Blockchain Transparency</h3>
                <p className="mt-2 text-muted-foreground">
                  Every signed vote hash is recorded on a public ledger, ensuring immutability and public verifiability.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <ListChecks className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Auditing</h3>
                <p className="mt-2 text-muted-foreground">
                  Our live dashboard provides instant vote tallies and a dynamic Transparency Index for complete public oversight.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
