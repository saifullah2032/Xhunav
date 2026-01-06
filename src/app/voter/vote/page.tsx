import VoteForm from "./vote-form";

export default function VotePage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Cast Your Vote</h1>
                <p className="text-muted-foreground">National Election 2024</p>
            </div>
            <VoteForm />
        </div>
    );
}
