import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Globe, Users, Truck, PiggyBank, Scale, Database, AlertCircle, Vote } from "lucide-react";

export default function NetworkOverview() {
  return (
    <div>
      <PageHeader title="Cooperative Network Control" description="Network-wide status and governance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Total Nodes" value="48" change="3 new this week" changeType="positive" icon={Globe} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Total Workers" value="12" change="2 online now" changeType="neutral" icon={Truck} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Total Sellers" value="34" change="All active" changeType="positive" icon={Users} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Total Members" value="52" change="4 governance" changeType="neutral" icon={Users} /></div>
        <div className="animate-fade-up stagger-5"><StatCard title="Shared Fund" value="₹84,200" change="+₹4,120 this week" changeType="positive" icon={PiggyBank} /></div>
        <div className="animate-fade-up"><StatCard title="Active Rules" value="8" change="1 under vote" changeType="neutral" icon={Scale} /></div>
        <div className="animate-fade-up"><StatCard title="Votes Active" value="2" change="Participation 87%" changeType="positive" icon={Vote} /></div>
        <div className="animate-fade-up"><StatCard title="Complaints Pending" value="2" change="1 under review" changeType="neutral" icon={AlertCircle} /></div>
        <div className="animate-fade-up"><StatCard title="Ledger Size" value="12,847" change="Transactions recorded" changeType="neutral" icon={Database} /></div>
      </div>

      <div className="bg-accent/30 border border-primary/10 rounded-lg p-5 animate-fade-up">
        <p className="text-[12px] font-medium mb-1">System governed by cooperative rules</p>
        <p className="text-[11px] text-muted-foreground">No central authority · All members share access to ledger, rules, and fund · Decisions made through cooperative voting</p>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Network rules active · System governed by cooperative · No central owner</p>
    </div>
  );
}
