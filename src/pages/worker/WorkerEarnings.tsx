import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Truck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const history = [
  { id: "TSK-410", date: "Today", deliveries: 1, amount: "₹48" },
  { id: "TSK-409", date: "Today", deliveries: 1, amount: "₹72" },
  { id: "TSK-408", date: "Today", deliveries: 1, amount: "₹65" },
  { id: "TSK-405", date: "Yesterday", deliveries: 1, amount: "₹85" },
  { id: "TSK-402", date: "Yesterday", deliveries: 1, amount: "₹55" },
  { id: "TSK-400", date: "2 days ago", deliveries: 1, amount: "₹92" },
  { id: "TSK-398", date: "2 days ago", deliveries: 1, amount: "₹68" },
];

export default function WorkerEarnings() {
  return (
    <div>
      <PageHeader title="Earnings" description="Your delivery earnings overview" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="This Week" value="₹2,840" change="32 deliveries" changeType="neutral" icon={DollarSign} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Total Balance" value="₹12,460" change="Includes cooperative share" changeType="neutral" icon={TrendingUp} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Avg. Per Delivery" value="₹68" change="+₹4 vs last week" changeType="positive" icon={Truck} /></div>
      </div>

      <p className="text-[11px] text-muted-foreground mb-5 animate-fade-up stagger-3">
        All members contribute to shared fund · Fund supports routing, intelligence, and system operation · Distribution follows cooperative rules
      </p>

      <div className="bg-card border rounded-lg animate-fade-up stagger-4">
        <div className="p-4 border-b">
          <h2 className="text-[13px] font-semibold">Earnings History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium text-sm">{h.id}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{h.date}</TableCell>
                <TableCell className="text-sm font-medium tabular-nums">{h.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
