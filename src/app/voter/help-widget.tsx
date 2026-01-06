'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { HelpCircle, Bot, User } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "How do I cast my vote?",
    answer: "Navigate to the 'Vote' page from the sidebar. Select your desired candidate and click the 'Vote' button. You will then be asked to confirm your choice."
  },
  {
    question: "Is my vote secure?",
    answer: "Yes, your vote is secured using Post-Quantum Cryptography and recorded on a private blockchain, ensuring it is both anonymous and tamper-proof."
  },
  {
    question: "Can I change my vote?",
    answer: "No, once a vote is cast, it is final and cannot be altered. Please review your selection carefully before confirming."
  },
  {
    question: "Where can I see the results?",
    answer: "You can view live election results and statistics on the 'Dashboard' page."
  }
];

export default function HelpWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversation, setConversation] = useState<{from: 'bot' | 'user', text: string}[]>([]);

    const handleQuestionClick = (faq: typeof faqs[0]) => {
        setConversation([
            ...conversation,
            { from: 'user', text: faq.question },
            { from: 'bot', text: faq.answer }
        ]);
    };
    
    const handleOpen = () => {
        setConversation([{from: 'bot', text: 'Hello! How can I assist you? Here are some common questions:'}]);
        setIsOpen(true);
    }

  return (
    <>
      <Card className="bg-green-600/10 border-green-600/20 text-foreground">
        <CardHeader className="p-4">
          <CardTitle className="text-base">Need Help?</CardTitle>
          <CardDescription className="text-xs">
            Contact our support team for any questions or issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleOpen}>
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Bot /> Support Assistant
            </DialogTitle>
            <DialogDescription>
                Ask a question or select one from the list below. For complex issues, please visit our full helpline page.
            </DialogDescription>
          </DialogHeader>
          <div className="h-64 overflow-y-auto p-4 space-y-4 bg-muted/50 rounded-md">
            {conversation.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                   {msg.from === 'bot' && <div className="p-2 rounded-full bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></div> }
                   <div className={`rounded-lg px-3 py-2 ${msg.from === 'bot' ? 'bg-background' : 'bg-primary/10'}`}>
                        <p className="text-sm">{msg.text}</p>
                   </div>
                   {msg.from === 'user' && <div className="p-2 rounded-full bg-accent text-accent-foreground"><User className="h-5 w-5"/></div> }
                </div>
            ))}
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {faqs.map(faq => (
                <Button key={faq.question} variant="outline" size="sm" className="text-xs h-auto py-2" onClick={() => handleQuestionClick(faq)}>{faq.question}</Button>
            ))}
          </div>
           <DialogFooter className="border-t pt-4">
                <p className="text-xs text-muted-foreground mr-auto">For more help, visit the full</p>
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="/voter/helpline">Helpline Page</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
