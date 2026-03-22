import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Heart } from "lucide-react";
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
      <PageHeader title="Earnings" description="Track your revenue and cooperative contributions" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Total Earnings" value="₹42,840" change="This month" changeType="neutral" icon={DollarSign} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Cooperative Contribution" value="₹2,570" change="6% shared fund" changeType="neutral" icon={Heart} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Net Balance" value="₹40,270" change="+18% vs last month" changeType="positive" icon={TrendingUp} /></div>
      </div>

      <p className="text-xs text-muted-foreground mb-4 animate-fade-up stagger-3">
        Shared fund supports routing, intelligence, and network operations. All members contribute to the shared system.
      </p>

      <div className="bg-card border rounded-lg animate-fade-up stagger-4">
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold">Earnings History</h2>
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
    </div>
  );
}
