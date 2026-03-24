import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ShoppingCart, Truck, Brain, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activityLog = [
  { event: "Order recorded", node: "NODE-IN-MH-012", detail: "ORD-1850 — ₹1,620", time: "5 min ago" },
  { event: "Delivery completed", node: "NODE-IN-MH-007", detail: "TSK-410 — Sector 12", time: "12 min ago" },
  { event: "Insight generated", node: "SYSTEM", detail: "Demand spike: MG Road area", time: "18 min ago" },
  { event: "Value distributed", node: "SYSTEM", detail: "₹485 to Worker W-007", time: "22 min ago" },
  { event: "New node joined", node: "NODE-IN-MH-048", detail: "Seller — Civil Lines", time: "1 hr ago" },
  { event: "Rule vote started", node: "NODE-IN-MH-003", detail: "PROP-012 — Contribution increase", time: "2 hr ago" },
  { event: "Fund contribution", node: "NODE-IN-MH-009", detail: "₹126 added to shared fund", time: "3 hr ago" },
];

export default function NetworkActivity() {
  return (
    <div>
      <PageHeader title="Network Activity" description="Live cooperative network events" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Orders Recorded" value="186" change="Today" changeType="neutral" icon={ShoppingCart} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Deliveries Completed" value="142" change="Today" changeType="neutral" icon={Truck} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Insights Generated" value="48" change="Today" changeType="neutral" icon={Brain} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Value Distributed" value="₹1.2L" change="Today" changeType="neutral" icon={DollarSign} /></div>
      </div>

      <div className="bg-card border rounded-lg animate-fade-up stagger-3">
        <div className="p-4 border-b">
          <h2 className="text-[13px] font-semibold">Recent Events</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLog.map((a, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm font-medium">{a.event}</TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{a.node}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.detail}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">System updated continuously · Data from shared ledger</p>
    </div>
  );
}
