import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Heart, Wallet, PiggyBank } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const history = [
  { id: "ORD-1845", date: "Today", gross: "₹2,100", fee: "₹126", net: "₹1,974" },
  { id: "ORD-1844", date: "Today", gross: "₹760", fee: "₹46", net: "₹714" },
  { id: "ORD-1840", date: "Yesterday", gross: "₹1,480", fee: "₹89", net: "₹1,391" },
  { id: "ORD-1838", date: "Yesterday", gross: "₹3,200", fee: "₹192", net: "₹3,008" },
  { id: "ORD-1835", date: "2 days ago", gross: "₹920", fee: "₹55", net: "₹865" },
  { id: "ORD-1832", date: "2 days ago", gross: "₹1,640", fee: "₹98", net: "₹1,542" },
];

export default function SellerEarnings() {
  return (
    <div>
      <PageHeader title="Earnings" description="Revenue and cooperative contributions" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Total Earnings" value="₹42,840" change="This month" changeType="neutral" icon={DollarSign} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Cooperative Contribution" value="₹2,570" change="6% shared fund" changeType="neutral" icon={Heart} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Net Balance" value="₹40,270" change="+18% vs last month" changeType="positive" icon={TrendingUp} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Shared Fund Balance" value="₹84,200" change="Network total" changeType="neutral" icon={PiggyBank} /></div>
        <div className="animate-fade-up stagger-5"><StatCard title="Your Contribution %" value="6%" change="Cooperative rule" changeType="neutral" icon={Wallet} /></div>
      </div>

      <div className="bg-accent/30 border border-primary/10 rounded-lg p-4 mb-5 animate-fade-up stagger-3">
        <p className="text-[12px] font-medium mb-1">Contribution rule applied</p>
        <p className="text-[11px] text-muted-foreground">
          Fund supports routing, intelligence, and infrastructure · Distribution follows cooperative rules · All members contribute to shared fund
        </p>
        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-primary/10">
          <div>
            <p className="text-sm font-semibold tabular-nums">₹84,200</p>
            <p className="text-[10px] text-muted-foreground">Shared fund balance</p>
          </div>
          <div>
            <p className="text-sm font-semibold tabular-nums">6%</p>
            <p className="text-[10px] text-muted-foreground">Your contribution %</p>
          </div>
          <div>
            <p className="text-sm font-semibold tabular-nums">Routing, Intel</p>
            <p className="text-[10px] text-muted-foreground">Network fund usage</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg animate-fade-up stagger-4">
        <div className="p-4 border-b">
          <h2 className="text-[13px] font-semibold">Earnings History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Contribution</TableHead>
              <TableHead>Net</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium text-sm">{h.id}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{h.date}</TableCell>
                <TableCell className="text-sm tabular-nums">{h.gross}</TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">{h.fee}</TableCell>
                <TableCell className="text-sm font-medium tabular-nums">{h.net}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Network rules active · Shared fund supports routing and intelligence</p>
    </div>
  );
}
