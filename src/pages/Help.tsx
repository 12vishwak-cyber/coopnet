import { PageHeader } from "@/components/PageHeader";
import { Globe, Database, Brain, Route, PiggyBank, Vote, Scale } from "lucide-react";

const topics = [
  {
    icon: Globe,
    title: "What is CoopNet?",
    content: "CoopNet is a decentralized cooperative network where sellers, workers, and members share delivery infrastructure, data, and governance. There is no central owner — the system is governed by cooperative rules.",
  },
  {
    icon: Scale,
    title: "How do rules work?",
    content: "All network rules are stored in the shared ledger and can be changed through member voting. Rules cover contribution rates, routing logic, distribution, and penalties. Any member can propose a rule change.",
  },
  {
    icon: PiggyBank,
    title: "How does the fund work?",
    content: "All members contribute a percentage of earnings to the shared fund. The fund supports routing infrastructure, collective intelligence, and emergency reserves. Usage is transparent and logged in the ledger.",
  },
  {
    icon: Vote,
    title: "How does voting work?",
    content: "Each member has one vote. Proposals require 60% approval to pass. Voting is open for a fixed period. Results are recorded in the shared ledger and applied automatically.",
  },
  {
    icon: Database,
    title: "How does the ledger work?",
    content: "The shared ledger records all transactions, contributions, distributions, rule changes, and assignments. Every member can view the ledger. Data is immutable and transparent.",
  },
  {
    icon: Brain,
    title: "What is Collective Intelligence?",
    content: "Demand forecasts, routing suggestions, and insights are generated from aggregated data across all sellers and workers. No single entity owns or controls this data.",
  },
  {
    icon: Route,
    title: "How does routing work?",
    content: "Delivery routes are optimized collectively using shared location, demand, and traffic data from all network nodes. Routes are assigned fairly based on proximity, load, and efficiency scores.",
  },
];

export default function Help() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Help" description="How CoopNet works" />

      <div className="space-y-3">
        {topics.map((t, i) => (
          <div key={t.title} className="bg-card border rounded-lg p-5 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <t.icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{t.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.content}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-4 animate-fade-up">
        No central owner · Cooperative governance · All members share access
      </p>
    </div>
  );
}
