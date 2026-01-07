import type { Candidate } from '@/app/admin/candidates/candidate-list';
import type { Voter } from '@/app/admin/voters/voter-list';
import type { Election } from '@/app/admin/elections/election-list';

async function sendEmail(to: string, subject: string, body: string) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, body }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API call to send email failed');
        }
        
        console.log(`Email request sent for: ${subject} to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback to console.log if API fails in dev environment
        if (process.env.NODE_ENV === 'development') {
            console.log('--- FALLBACK: SIMULATING EMAIL (API FAILED) ---');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log('---');
            console.log(body);
            console.log('-------------------------------------------\n');
        }
    }
}

export function sendCandidateAddedEmail(candidate: Candidate) {
    const subject = 'Congratulations! You are a Candidate';
    const body = `Dear ${candidate.name},\n\nCongratulations! You have been added as a candidate for the ${candidate.party}.\n\nWe wish you the best of luck in the upcoming election.\n\nSincerely,\nThe Xhunav Election Commission`;
    sendEmail(candidate.email, subject, body);
}

export function sendVoterAddedEmail(voter: Voter) {
    const subject = 'Voter Registration Successful';
    const body = `Dear ${voter.name},\n\nThis email confirms that you have been successfully registered as a voter in the Xhunav E-Voting System.\n\nYou can now participate in upcoming elections.\n\nSincerely,\nThe Xhunav Election Commission`;
    sendEmail(voter.email, subject, body);
}

export function sendElectionWinnerEmail(winner: Candidate) {
    const subject = 'Congratulations! You Have Won the Election';
    const body = `Dear ${winner.name},\n\nCongratulations! We are pleased to inform you that you have won the election for your constituency.\n\nYour dedication and hard work have paid off. We look forward to your leadership.\n\nSincerely,\nThe Xhunav Election Commission`;
    sendEmail(winner.email, subject, body);
}

export function sendElectionResultsEmail(recipients: (Candidate | Voter)[], winner: Candidate, election: Election, voteCount: number) {
    const subject = `Results for ${election.name}`;
    const body = `Dear Voter/Candidate,\n\nThe ${election.name} has concluded.\n\nThe winner is ${winner.name} of the ${winner.party} with ${voteCount.toLocaleString()} votes.\n\nThank you for your participation in this democratic process.\n\nSincerely,\nThe Xhunav Election Commission`;

    recipients.forEach(recipient => {
        if (recipient.id !== winner.id) {
            sendEmail(recipient.email, subject, body);
        }
    });
}
