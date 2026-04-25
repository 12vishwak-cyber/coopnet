import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Vote, Users, ThumbsUp, ThumbsDown } from "lucide-react";
import { useGovernance } from "@/lib/governance";

type Variant = "compact" | "full";

type Props = {
  role: "customer" | "seller" | "worker";
  variant?: Variant;
  /** When true, renders a flat card (for embedding inside customer pages). */
  flat?: boolean;
};

/**
 * Shared governance voting panel — used by Customer Network, Seller Voting,
 * and Worker dashboards. Backed by Lovable Cloud governance tables so the
 * tally is the same everywhere.
 */
export default function VotingPanel({ role, variant = "full", flat = false }: Props) {
  const { proposals, loading, vote } = useGovernance(role);

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <Vote className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm font-bold text-foreground">No active proposals</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Members can submit one anytime</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {proposals.map((p) => {
        const totalVotes = p.votesFor + p.votesAgainst;
        const approval = totalVotes ? Math.round((p.votesFor / totalVotes) * 100) : 0;
        const participation = Math.round((totalVotes / Math.max(p.total_members, 1)) * 100);
        const deadline = p.deadline_at ? new Date(p.deadline_at) : null;
        const daysLeft = deadline
          ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86_400_000))
          : null;
        const cardCls = flat
          ? "bg-card rounded-2xl p-4 shadow-sm border border-border"
          : "bg-card rounded-2xl p-5 border border-border animate-fade-up";

        return (
          <div key={p.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-muted-foreground font-mono">{p.code}</span>
                  {p.status === "approved" ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Approved
                    </span>
                  ) : p.status === "rejected" ? (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                      Rejected
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Voting
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{p.title}</h3>
                {variant === "full" && (
                  <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  by {p.proposer_label} · {p.proposer_role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Progress value={approval} className="h-2 flex-1" />
              <span className="text-[11px] font-bold text-muted-foreground tabular-nums w-10 text-right">
                {approval}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
              <span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.votesFor}</span> for ·{" "}
                <span className="font-bold text-rose-500">{p.votesAgainst}</span> against
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participation}%
              </span>
            </div>

            {p.status === "voting" && (
              <div className="flex items-center gap-2">
                {p.myVote ? (
                  <div className="flex-1 text-center bg-muted rounded-xl py-2.5 text-xs font-bold text-muted-foreground">
                    ✓ You voted{" "}
                    <span className={p.myVote === "for" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}>
                      {p.myVote === "for" ? "For" : "Against"}
                    </span>
                  </div>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => vote(p.id, "for")}
                      className="flex-1 h-9 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" /> Vote For
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => vote(p.id, "against")}
                      className="flex-1 h-9 rounded-xl text-xs font-bold border-border"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" /> Against
                    </Button>
                  </>
                )}
                {daysLeft !== null && (
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                    {daysLeft}d left
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
