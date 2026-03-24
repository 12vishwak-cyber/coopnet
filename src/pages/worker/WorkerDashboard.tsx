import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Truck, DollarSign, ClipboardList, BarChart3, ToggleLeft, ToggleRight, Globe, Zap, MapPin, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const tasks = [
  { id: "TSK-412", seller: "Sharma General Store", pickup: "MG Road", delivery: "Sector 12", items: 3, pay: "₹65", status: "assigned" },
  { id: "TSK-411", seller: "Fresh Mart", pickup: "Civil Lines", delivery: "Gandhi Chowk", items: 1, pay: "₹45", status: "in-transit" },
  { id: "TSK-410", seller: "Daily Needs", pickup: "Station Road", delivery: "Anand Nagar", items: 5, pay: "₹85", status: "completed" },
];

const performanceStats = [
  { label: "On-time Rate", value: "96.2%" },
  { label: "Avg. Delivery", value: "22 min" },
  { label: "Rating", value: "4.8/5" },
];

export default function WorkerDashboard() {
  const [available, setAvailable] = useState(true);

  return (
    <div>
      <PageHeader title="Dashboard" description="Your delivery overview" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Availability */}
        <div className="bg-card border rounded-lg p-5 flex items-center justify-between animate-fade-up">
          <div>
            <p className="text-[13px] font-medium">Availability</p>
            <p className="text-[11px] text-muted-foreground">{available ? "Visible to the network" : "Won't receive new tasks"}</p>
          </div>
          <button onClick={() => setAvailable(!available)} className="flex items-center gap-2 transition-colors">
            {available ? <ToggleRight className="h-8 w-8 text-success" /> : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
            <span className={`text-sm font-medium ${available ? "text-success" : "text-muted-foreground"}`}>
              {available ? "Online" : "Offline"}
            </span>
          </button>
        </div>

        {/* Network Status */}
        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold">Network Status</h3>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-success font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
              Connected
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-lg font-semibold tabular-nums">12</p>
              <p className="text-[11px] text-muted-foreground">Workers</p>
            </div>
            <div>
              <p className="text-lg font-semibold tabular-nums">8</p>
              <p className="text-[11px] text-muted-foreground">Deliveries</p>
            </div>
            <div>
              <p className="text-lg font-semibold tabular-nums">High</p>
              <p className="text-[11px] text-muted-foreground">Demand</p>
            </div>
          </div>
        </div>

        {/* New: Predictions & Intelligence */}
        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-warning" />
            <h3 className="text-[13px] font-semibold">Network Intelligence</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Next assignment</span>
              <span className="text-[12px] font-medium">Sector 12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" />Demand hotspot</span>
              <span className="text-[12px] font-medium">MG Road</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><BarChart3 className="h-3 w-3" />Efficiency score</span>
              <span className="text-[12px] font-medium">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Database className="h-3 w-3" />Ledger sync</span>
              <span className="text-[10px] text-success font-medium">Synced</span>
            </div>
          </div>
        </div>

        {/* Cooperative Info */}
        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-3">
          <h3 className="text-[13px] font-semibold mb-3">Cooperative Routing</h3>
          <ul className="space-y-2 text-[12px] text-muted-foreground">
            <li className="flex items-start gap-2"><span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />Assigned using cooperative routing</li>
            <li className="flex items-start gap-2"><span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />Routes optimized using shared data</li>
            <li className="flex items-start gap-2"><span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />Earnings include contribution</li>
            <li className="flex items-start gap-2"><span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />No central owner</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Active Tasks" value="2" change="1 pending pickup" changeType="neutral" icon={Truck} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Today's Earnings" value="₹485" change="7 deliveries" changeType="positive" icon={DollarSign} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Completed Today" value="7" change="+3 vs yesterday" changeType="positive" icon={ClipboardList} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Performance" value="96%" change="Top 15% worker" changeType="positive" icon={BarChart3} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border rounded-lg animate-fade-up stagger-3">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-[13px] font-semibold">Assigned Tasks</h2>
            <span className="text-[10px] text-muted-foreground">Assigned by network</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Pay</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-sm">{t.id}</TableCell>
                  <TableCell className="text-sm">{t.seller}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.pickup}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.delivery}</TableCell>
                  <TableCell className="text-sm font-medium tabular-nums">{t.pay}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-4 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-[13px] font-semibold">Performance</h3>
          </div>
          <div className="space-y-4">
            {performanceStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-semibold tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-[11px] text-muted-foreground">
              <span className="text-primary font-medium">Network Suggestion:</span> You're most efficient in Sector 12 area.
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Routing optimized using shared intelligence</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Network rules active · System governed by cooperative · Transaction recorded in ledger</p>
    </div>
  );
}
