import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { PiggyBank, ArrowUpRight, Server, Shield, Wallet } from "lucide-react";

export default function NetworkFund() {
  return (
    <div>
      <PageHeader title="Shared Fund" description="Cooperative fund allocation and usage" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Total Fund" value="₹84,200" change="Current balance" changeType="neutral" icon={PiggyBank} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="This Month" value="₹12,480" change="Contributions" changeType="positive" icon={ArrowUpRight} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="System Cost" value="₹4,200" change="Infrastructure" changeType="neutral" icon={Server} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Routing Cost" value="₹3,100" change="Optimization engine" changeType="neutral" icon={Wallet} /></div>
        <div className="animate-fade-up stagger-5"><StatCard title="Reserve" value="₹5,180" change="Emergency fund" changeType="neutral" icon={Shield} /></div>
      </div>

      <div className="bg-accent/30 border border-primary/10 rounded-lg p-5 animate-fade-up">
        <p className="text-[12px] font-medium mb-1">Fund supports routing, intelligence, and infrastructure</p>
        <p className="text-[11px] text-muted-foreground">All members contribute · Distribution follows cooperative rules · No central authority controls the fund</p>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Network rules active · Contribution rules applied</p>
    </div>
  );
}
