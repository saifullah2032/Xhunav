import type { Candidate, Voter, Election } from './data';

const ADMIN_EMAIL = 'admin@xhunav.com';

// Simulates sending an email by logging to the console.
// In a real app, this would use an email service like SendGrid, Mailgun, etc.
function sendEmail(to: string, from: string, subject: string, body: string) {
    console.log('--- SIMULATING EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`From: ${from}`);
    console.log(`Subject: ${subject}`);
    console.log('---');
    console.log(body);
    console.log('------------------------\n');
}

export function sendCandidateAddedEmail(candidate: Candidate) {
    const subject = 'Congratulations! You are a Candidate';
    const body = `Dear ${candidate.name},\n\nCongratulations! You have been added as a candidate for the ${candidate.party}.\n\nWe wish you the best of luck in the upcoming election.\n\nSincerely,\nThe Xhunav Election Commission`;
    sendEmail(candidate.email, ADMIN_EMAIL, subject, body);
}

export function sendVoterAddedEmail(voter: Voter) {
    const subject = 'Voter Registration Successful';
    const body = `Dear ${voter.name},\n\nThis email confirms that you have been successfully registered as a voter in the Xhunav E-Voting System.\n\nYou can now participate in upcoming elections.\n\nSincerely,\nThe Xhunav Election Commission`;
    sendEmail(voter.email, ADMIN_EMAIL, subject, body);
}

export function sendElectionWinnerEmail(winner: Candidate) {
    const subject = 'Congratulations! You Have Won the Election';
    const body = `Dear ${winner.name},\n\nCongratulations! We are pleased to inform you that you have won the election for your constituency.\n\nYour dedication and hard work have paid off. We look forward to your leadership.\n\nSincerely,\nThe Xhunav Election Commission`;
    sendEmail(winner.email, ADMIN_EMAIL, subject, body);
}

export function sendElectionResultsEmail(recipients: (Candidate | Voter)[], winner: Candidate, election: Election) {
    const subject = `Results for ${election.name}`;
    const body = `Dear Voter/Candidate,\n\nThe ${election.name} has concluded.\n\nThe winner is ${winner.name} of the ${winner.party} with ${winner.votes.toLocaleString()} votes.\n\nThank you for your participation in this democratic process.\n\nSincerely,\nThe Xhunav Election Commission`;

    recipients.forEach(recipient => {
        // Don't send this general announcement to the winner, as they get a separate email.
        if (recipient.id !== winner.id) {
            sendEmail(recipient.email, ADMIN_EMAIL, subject, body);
        }
    });
}
