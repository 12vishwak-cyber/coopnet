import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Vote } from "lucide-react";

const proposals = [
  {
    id: "PROP-012",
    title: "Increase contribution rate to 7%",
    proposer: "NODE-IN-MH-003",
    description: "Increase cooperative contribution from 6% to 7% to fund new routing infrastructure.",
    votesFor: 28,
    votesAgainst: 14,
    totalMembers: 48,
    status: "voting",
    deadline: "2 days remaining",
  },
  {
    id: "PROP-011",
    title: "Change routing rule to include fuel cost",
    proposer: "NODE-IN-MH-007",
    description: "Factor in estimated fuel cost when assigning routes to workers.",
    votesFor: 36,
    votesAgainst: 8,
    totalMembers: 48,
    status: "voting",
    deadline: "5 days remaining",
  },
  {
    id: "PROP-010",
    title: "New distribution rule for peak hours",
    proposer: "NODE-IN-MH-001",
    description: "Apply 1.2x multiplier for deliveries during 6-9 PM peak window.",
    votesFor: 42,
    votesAgainst: 4,
    totalMembers: 48,
    status: "approved",
    deadline: "Approved 3 days ago",
  },
];

export default function NetworkVoting() {
  return (
    <div>
      <PageHeader title="Rule Proposals" description="Vote on cooperative rule changes" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">Rules activated after approval · Rules decided by cooperative</p>

      <div className="space-y-4">
        {proposals.map((p) => {
          const totalVotes = p.votesFor + p.votesAgainst;
          const approvalRate = Math.round((p.votesFor / totalVotes) * 100);
          const participation = Math.round((totalVotes / p.totalMembers) * 100);

          return (
            <div key={p.id} className="bg-card border rounded-lg p-5 animate-fade-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">{p.id}</span>
                    {p.status === "approved" ? (
                      <span className="text-[10px] font-medium text-success flex items-center gap-1"><Check className="h-3 w-3" />Approved</span>
                    ) : (
                      <span className="text-[10px] font-medium text-warning flex items-center gap-1"><Clock className="h-3 w-3" />Voting</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1">{p.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Proposed by {p.proposer}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold tabular-nums text-success">{p.votesFor} For</p>
                </div>
                <div>
                  <p className="text-sm font-semibold tabular-nums text-destructive">{p.votesAgainst} Against</p>
                </div>
                <div>
                  <p className="text-sm font-semibold tabular-nums">{participation}% participation</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Approval: {approvalRate}%</span>
                  <span>{p.deadline}</span>
                </div>
                <Progress value={approvalRate} className="h-1.5" />
              </div>

              {p.status === "voting" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-7 text-success border-success/30">
                    <Vote className="h-3 w-3 mr-1" /> Vote For
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7 text-destructive border-destructive/30">
                    <Vote className="h-3 w-3 mr-1" /> Vote Against
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Rules activated after approval · System governed by cooperative</p>
    </div>
  );
}
