import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, ShieldAlert } from "lucide-react";

export default function HelplinePage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Support & Helpline</h1>
                <p className="text-muted-foreground">We're here to help you 24/7.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Phone className="w-8 h-8 text-primary" />
                        <CardTitle>General Enquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">1800-123-4567</p>
                        <p className="text-sm text-muted-foreground">Toll-free number for any questions about the voting process.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <ShieldAlert className="w-8 h-8 text-destructive" />
                        <CardTitle>Emergency Security Hotline</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-lg font-semibold">1800-765-4321</p>
                        <p className="text-sm text-muted-foreground">To report any suspicious activity or security concerns.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Mail className="w-8 h-8 text-accent" />
                        <CardTitle>Email Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-lg font-semibold">support@xhunav.gov.in</p>
                        <p className="text-sm text-muted-foreground">For non-urgent issues, reach out to us via email.</p>
                    </CardContent>
                </Card>
            </div>

             <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find quick answers to common questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold">How do I verify my identity?</h4>
                        <p className="text-muted-foreground">Follow the on-screen instructions during the login process to scan your government-issued ID card using your device's camera.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Is my vote anonymous?</h4>
                        <p className="text-muted-foreground">Yes. Your vote is encrypted and separated from your identity. The blockchain record is anonymized to ensure privacy.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">What if I make a mistake?</h4>
                        <p className="text-muted-foreground">Once your vote is cast and signed, it is final and cannot be changed. Please review your selection carefully before confirming.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
