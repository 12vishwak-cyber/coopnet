import { useState } from "react";
import { Globe, Scale, Vote, Activity, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const rules = [
  { name: "Contribution Rate", value: "6% of order value", status: "Active" },
  { name: "Routing Logic", value: "Proximity + load balance + performance", status: "Active" },
  { name: "Distribution Rule", value: "78% seller · 12% worker · 6% fund · 4% system", status: "Active" },
  { name: "Penalty Rule", value: "3 violations → review by committee", status: "Active" },
  { name: "Voting Rule", value: "60% majority required", status: "Active" },
];

const proposals = [
  { title: "Increase contribution to 7%", proposer: "Member-14", votesFor: 28, votesAgainst: 12, total: 48, status: "voting" },
  { title: "Add customer loyalty rewards", proposer: "Seller-23", votesFor: 35, votesAgainst: 5, total: 48, status: "voting" },
  { title: "Reduce system cost allocation", proposer: "Worker-07", votesFor: 40, votesAgainst: 3, total: 48, status: "approved" },
];

const events = [
  { text: "Order ORD-1847 recorded in ledger", time: "2m ago" },
  { text: "Fund contribution: ₹34 from your order", time: "2m ago" },
  { text: "Rule proposal submitted by Member-14", time: "1h ago" },
  { text: "Network routing updated", time: "3h ago" },
  { text: "42 orders processed today", time: "5h ago" },
];

export default function CustomerNetwork() {
  const [tab, setTab] = useState<"rules" | "proposals" | "activity">("rules");

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" /> Network Governance
        </h1>
        <p className="text-xs text-muted-foreground">Participate in cooperative decision-making</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-1">
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-lg font-semibold">48</p>
          <p className="text-[10px] text-muted-foreground">Members</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-lg font-semibold">2</p>
          <p className="text-[10px] text-muted-foreground">Active Votes</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <p className="text-lg font-semibold">5</p>
          <p className="text-[10px] text-muted-foreground">Active Rules</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 animate-fade-up stagger-1">
        {(["rules", "proposals", "activity"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-sm py-2 rounded-md capitalize transition-colors ${tab === t ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
          >{t}</button>
        ))}
      </div>

      {tab === "rules" && (
        <div className="space-y-2 animate-fade-up stagger-2">
          {rules.map(r => (
            <div key={r.name} className="bg-card border rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.value}</p>
                </div>
              </div>
              <span className="text-[10px] text-success font-medium">{r.status}</span>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground text-center">Rules decided by cooperative · Stored in shared ledger</p>
        </div>
      )}

      {tab === "proposals" && (
        <div className="space-y-3 animate-fade-up stagger-2">
          <div className="bg-accent/30 border border-primary/10 rounded-lg p-3">
            <p className="text-xs font-medium text-primary">You are eligible to vote</p>
            <p className="text-[10px] text-muted-foreground">5+ orders completed · Governance rights active</p>
          </div>
          {proposals.map(p => {
            const approval = Math.round((p.votesFor / (p.votesFor + p.votesAgainst)) * 100);
            const participation = Math.round(((p.votesFor + p.votesAgainst) / p.total) * 100);
            return (
              <div key={p.title} className="bg-card border rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-[11px] text-muted-foreground">Proposed by {p.proposer}</p>
                  </div>
                  {p.status === "approved" ? (
                    <span className="flex items-center gap-1 text-[10px] text-success"><Check className="h-3 w-3" />Approved</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-warning"><Clock className="h-3 w-3" />Voting</span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Approval: {approval}%</span>
                    <span>Participation: {participation}%</span>
                  </div>
                  <Progress value={approval} className="h-1.5" />
                </div>
                {p.status === "voting" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-7 text-xs">Vote For</Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">Vote Against</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Network Events</span>
          </div>
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="flex items-start gap-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs">{e.text}</p>
                  <p className="text-[10px] text-muted-foreground">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">System updated continuously · All members share access</p>
        </div>
      )}
    </div>
  );
}
