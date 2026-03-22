import { ShoppingCart, DollarSign, AlertTriangle, TrendingUp, Package, Lightbulb, Globe, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const recentOrders = [
  { id: "ORD-1847", customer: "Priya M.", items: 3, total: "₹1,240", status: "pending", time: "12 min ago" },
  { id: "ORD-1846", customer: "Ravi K.", items: 1, total: "₹380", status: "active", time: "28 min ago" },
  { id: "ORD-1845", customer: "Anita S.", items: 5, total: "₹2,100", status: "completed", time: "1 hr ago" },
  { id: "ORD-1844", customer: "Deepak R.", items: 2, total: "₹760", status: "completed", time: "2 hr ago" },
];

const demandInsights = [
  { item: "Rice (5kg)", trend: "+23%", reason: "Festival season demand" },
  { item: "Cooking Oil", trend: "+15%", reason: "Price drop competitor" },
  { item: "Detergent", trend: "-8%", reason: "Seasonal decline" },
];

const stockSuggestions = [
  { item: "Wheat Flour (1kg)", current: 12, suggested: 50, reason: "High demand forecast" },
  { item: "Sugar (500g)", current: 8, suggested: 30, reason: "Low stock, steady demand" },
];

export default function SellerDashboard() {
  return (
    <div>
      <PageHeader title="Seller Dashboard" description="Overview of your store performance" />

      {/* Network Status Card */}
      <div className="bg-card border rounded-lg p-4 mb-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Network Status</h3>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-success font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
            Connected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-lg font-semibold tabular-nums">34</p>
            <p className="text-xs text-muted-foreground">Active sellers</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">12</p>
            <p className="text-xs text-muted-foreground">Active workers</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">High</p>
            <p className="text-xs text-muted-foreground">Area demand level</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">94.7%</p>
            <p className="text-xs text-muted-foreground">Network efficiency</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Today's Orders" value="24" change="+12% from yesterday" changeType="positive" icon={ShoppingCart} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Revenue" value="₹18,420" change="+8.3% this week" changeType="positive" icon={DollarSign} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Low Stock Items" value="7" change="3 critical" changeType="negative" icon={AlertTriangle} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Demand Score" value="82/100" change="Above area avg" changeType="positive" icon={TrendingUp} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border rounded-lg animate-fade-up stagger-3">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold">Recent Orders</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-sm">{o.id}</TableCell>
                  <TableCell className="text-sm">{o.customer}</TableCell>
                  <TableCell className="text-sm">{o.items}</TableCell>
                  <TableCell className="text-sm">{o.total}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Collective Intelligence</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Powered by shared network data</p>
            <div className="space-y-3">
              {demandInsights.map((d) => (
                <div key={d.item} className="flex items-center justify-between text-sm">
                  <span>{d.item}</span>
                  <span className={`font-medium ${d.trend.startsWith("+") ? "text-success" : "text-destructive"}`}>{d.trend}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-5">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold">Network Suggestions</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Suggestions generated using collective data from all sellers and workers</p>
            <div className="space-y-3">
              {stockSuggestions.map((s) => (
                <div key={s.item} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{s.item}</span>
                    <span className="text-muted-foreground">{s.current} → {s.suggested}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
