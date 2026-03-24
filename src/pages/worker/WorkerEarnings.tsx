import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Truck, Heart, PiggyBank } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const history = [
  { id: "TSK-410", date: "Today", gross: "₹52", contribution: "₹4", net: "₹48" },
  { id: "TSK-409", date: "Today", gross: "₹78", contribution: "₹6", net: "₹72" },
  { id: "TSK-408", date: "Today", gross: "₹70", contribution: "₹5", net: "₹65" },
  { id: "TSK-405", date: "Yesterday", gross: "₹92", contribution: "₹7", net: "₹85" },
  { id: "TSK-402", date: "Yesterday", gross: "₹60", contribution: "₹5", net: "₹55" },
  { id: "TSK-400", date: "2 days ago", gross: "₹100", contribution: "₹8", net: "₹92" },
  { id: "TSK-398", date: "2 days ago", gross: "₹74", contribution: "₹6", net: "₹68" },
];

export default function WorkerEarnings() {
  return (
    <div>
      <PageHeader title="Earnings" description="Your delivery earnings overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="This Week" value="₹2,840" change="32 deliveries" changeType="neutral" icon={DollarSign} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Total Balance" value="₹12,460" change="Includes cooperative share" changeType="neutral" icon={TrendingUp} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Avg. Per Delivery" value="₹68" change="+₹4 vs last week" changeType="positive" icon={Truck} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Contribution Applied" value="₹284" change="Fund share included" changeType="neutral" icon={Heart} /></div>
        <div className="animate-fade-up stagger-5"><StatCard title="Network Fund" value="₹84,200" change="Rule based distribution" changeType="neutral" icon={PiggyBank} /></div>
      </div>

      <div className="bg-accent/30 border border-primary/10 rounded-lg p-4 mb-5 animate-fade-up stagger-3">
        <p className="text-[12px] font-medium mb-1">Network fund contribution applied</p>
        <p className="text-[11px] text-muted-foreground">
          All members contribute to shared fund · Fund supports routing, intelligence, and system operation · Distribution follows cooperative rules
        </p>
      </div>

      <div className="bg-card border rounded-lg animate-fade-up stagger-4">
        <div className="p-4 border-b">
          <h2 className="text-[13px] font-semibold">Earnings History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
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
                <TableCell className="text-sm text-muted-foreground tabular-nums">{h.contribution}</TableCell>
                <TableCell className="text-sm font-medium tabular-nums">{h.net}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Network rules active · Contribution rules applied · Shared intelligence active</p>
    </div>
  );
}
