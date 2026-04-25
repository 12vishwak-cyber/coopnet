import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Proposal = {
  id: string;
  code: string;
  title: string;
  description: string;
  proposer_label: string;
  proposer_role: string;
  status: "voting" | "approved" | "rejected";
  total_members: number;
  required_majority: number;
  deadline_at: string | null;
  created_at: string;
};

export type Vote = {
  id: string;
  proposal_id: string;
  vote: "for" | "against";
  voter_role: "customer" | "seller" | "worker";
  voter_key: string;
  created_at: string;
};

export type ProposalWithTally = Proposal & {
  votesFor: number;
  votesAgainst: number;
  myVote: "for" | "against" | null;
};

const VOTER_KEY_STORAGE = "coopnet:voter:v1";

/** Stable per-browser voter key so we can detect "already voted" without auth. */
export function getVoterKey(): string {
  try {
    let k = localStorage.getItem(VOTER_KEY_STORAGE);
    if (!k) {
      k = `voter_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem(VOTER_KEY_STORAGE, k);
    }
    return k;
  } catch {
    return `voter_anon_${Date.now()}`;
  }
}

export function useGovernance(role: "customer" | "seller" | "worker") {
  const [proposals, setProposals] = useState<ProposalWithTally[]>([]);
  const [loading, setLoading] = useState(true);
  const voterKey = getVoterKey();

  const refresh = useCallback(async () => {
    const [{ data: props }, { data: votes }] = await Promise.all([
      supabase.from("governance_proposals").select("*").order("created_at", { ascending: false }),
      supabase.from("governance_votes").select("*"),
    ]);
    if (!props) {
      setProposals([]);
      setLoading(false);
      return;
    }
    const merged: ProposalWithTally[] = (props as Proposal[]).map((p) => {
      const pv = (votes as Vote[] | null)?.filter((v) => v.proposal_id === p.id) ?? [];
      const mine = pv.find((v) => v.voter_key === voterKey && v.voter_role === role);
      return {
        ...p,
        votesFor: pv.filter((v) => v.vote === "for").length,
        votesAgainst: pv.filter((v) => v.vote === "against").length,
        myVote: (mine?.vote as "for" | "against" | undefined) ?? null,
      };
    });
    setProposals(merged);
    setLoading(false);
  }, [voterKey, role]);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel(`governance:${role}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "governance_votes" }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "governance_proposals" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refresh, role]);

  const vote = useCallback(
    async (proposalId: string, choice: "for" | "against") => {
      const target = proposals.find((p) => p.id === proposalId);
      if (target?.myVote) {
        toast.info("You've already voted on this proposal");
        return;
      }
      if (target?.status !== "voting") {
        toast.info("Voting is closed for this proposal");
        return;
      }
      const { error } = await supabase.from("governance_votes").insert({
        proposal_id: proposalId,
        vote: choice,
        voter_role: role,
        voter_key: voterKey,
      });
      if (error) {
        toast.error("Couldn't record your vote");
        console.warn(error);
        return;
      }
      toast.success(`Vote recorded — ${choice === "for" ? "For" : "Against"}`);
      refresh();
    },
    [proposals, refresh, role, voterKey]
  );

  return { proposals, loading, vote, refresh };
}
