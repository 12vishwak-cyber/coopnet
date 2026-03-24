import { PageHeader } from "@/components/PageHeader";
import { Globe, Database, Brain, Route, Heart, Scale, ArrowRight } from "lucide-react";

const features = [
  { icon: Database, title: "Shared Ledger", desc: "All transactions and data stored in a transparent, shared system accessible to every cooperative member." },
  { icon: Brain, title: "Collective Intelligence", desc: "Demand forecasts, routing suggestions, and insights generated from aggregated network-wide data." },
  { icon: Route, title: "Cooperative Routing", desc: "Delivery routes optimized collectively across all workers using shared location and demand data." },
  { icon: Heart, title: "Shared Fund", desc: "Members contribute to a cooperative fund that supports infrastructure, routing, and intelligence systems." },
  { icon: Scale, title: "Rule-Based Distribution", desc: "Earnings, tasks, and resources distributed transparently using cooperative rules — not central decisions." },
];

const loopSteps = ["Ledger", "Intelligence", "Routing", "Delivery", "Fund", "Distribution"];

export default function About() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="About" description="CoopNet Cooperative Network" />

      <div className="bg-card border rounded-lg p-6 mb-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">What is CoopNet?</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          CoopNet is a decentralized cooperative system where sellers, workers, and nodes share delivery infrastructure, data, and value. There is no central owner — the network operates through cooperative rules and shared intelligence.
        </p>
      </div>

      {/* System Loop */}
      <div className="bg-accent/30 border border-primary/10 rounded-lg p-5 mb-6 animate-fade-up stagger-1">
        <h3 className="text-[13px] font-semibold mb-3">System Loop</h3>
        <div className="flex flex-wrap items-center gap-1">
          {loopSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-1">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md">{step}</span>
              {i < loopSteps.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md">Ledger</span>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-[11px] text-muted-foreground">All transactions recorded · All data shared · All rules applied collectively</p>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((f) => (
          <div key={f.title} className="bg-card border rounded-lg p-4 flex gap-4 items-start animate-fade-up">
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <f.icon className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground mt-6 animate-fade-up">
        No central owner · Cooperative governance · Shared infrastructure
      </p>
    </div>
  );
}
