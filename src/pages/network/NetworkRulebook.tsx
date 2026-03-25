import { PageHeader } from "@/components/PageHeader";
import { Scale, Calendar, User, Vote, Database } from "lucide-react";

const rules = [
  {
    title: "Contribution Rule",
    desc: "All members contribute 6% of earnings to the shared cooperative fund.",
    why: "Fund supports routing infrastructure, collective intelligence engine, and network operations.",
    proposer: "Founding members",
    created: "Oct 2024",
    changeable: true,
  },
  {
    title: "Routing Rule",
    desc: "Delivery routes are generated using shared network data including demand, location, and traffic patterns.",
    why: "Collective routing reduces fuel cost, time, and ensures fair distribution of deliveries.",
    proposer: "NODE-IN-MH-001",
    created: "Oct 2024",
    changeable: true,
  },
  {
    title: "Distribution Rule",
    desc: "Earnings are distributed based on completed deliveries, distance, and contribution history.",
    why: "Transparent distribution ensures fairness and prevents central decision-making.",
    proposer: "Founding members",
    created: "Oct 2024",
    changeable: true,
  },
  {
    title: "Penalty Rule",
    desc: "Repeated order cancellations or delivery failures result in reduced priority score.",
    why: "Maintains service quality across the cooperative network.",
    proposer: "NODE-IN-MH-003",
    created: "Nov 2024",
    changeable: true,
  },
  {
    title: "Voting Rule",
    desc: "All active members have one vote. Proposals require 60% approval to pass.",
    why: "Democratic governance ensures no single entity controls the network.",
    proposer: "Founding members",
    created: "Oct 2024",
    changeable: true,
  },
  {
    title: "Member Rule",
    desc: "Sellers and workers become members automatically. Governance members require vote approval.",
    why: "Open membership with governance safeguards.",
    proposer: "Founding members",
    created: "Oct 2024",
    changeable: true,
  },
  {
    title: "Fund Rule",
    desc: "Shared fund can only be used for infrastructure, routing, intelligence, and emergency reserve.",
    why: "Prevents misuse and ensures fund serves the cooperative's purpose.",
    proposer: "NODE-IN-MH-007",
    created: "Dec 2024",
    changeable: true,
  },
];

export default function NetworkRulebook() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Rulebook" description="Full cooperative rule details" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">
        <Database className="h-3 w-3 inline mr-1 text-primary" />
        Rules stored in shared ledger · Can be changed by vote
      </p>

      <div className="space-y-3">
        {rules.map((r, i) => (
          <div key={r.title} className="bg-card border rounded-lg p-5 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{r.title}</h3>
            </div>
            <p className="text-sm text-foreground mb-2">{r.desc}</p>
            <p className="text-xs text-muted-foreground mb-3">{r.why}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {r.proposer}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {r.created}</span>
              {r.changeable && <span className="flex items-center gap-1 text-primary"><Vote className="h-3 w-3" /> Changeable by vote</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-4">
        System governed by cooperative · No central authority
      </p>
    </div>
  );
}
