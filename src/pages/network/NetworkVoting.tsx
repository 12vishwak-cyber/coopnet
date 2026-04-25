import { PageHeader } from "@/components/PageHeader";
import { Shield } from "lucide-react";
import VotingPanel from "@/components/VotingPanel";

export default function NetworkVoting() {
  return (
    <div>
      <PageHeader title="Rule Proposals" description="Vote on cooperative rule changes" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">
        Rules activated after approval · Decided by the cooperative
      </p>

      <div className="bg-accent/30 border border-primary/10 rounded-lg p-4 mb-4 flex items-center gap-3 animate-fade-up">
        <Shield className="h-4 w-4 text-primary shrink-0" />
        <div>
          <p className="text-xs font-medium text-primary">You are eligible to vote</p>
          <p className="text-[10px] text-muted-foreground">
            Voting rights: Active · Member role: Seller · One member, one vote
          </p>
        </div>
      </div>

      <VotingPanel role="seller" variant="full" />

      <p className="text-[10px] text-muted-foreground mt-3">
        Rules activated after approval · System governed by the cooperative
      </p>
    </div>
  );
}
