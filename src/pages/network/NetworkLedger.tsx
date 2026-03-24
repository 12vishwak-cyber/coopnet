import { PageHeader } from "@/components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ledgerEntries = [
  { tx: "TX-9847", node: "NODE-IN-MH-012", type: "Order", amount: "₹1,620", time: "5 min ago" },
  { tx: "TX-9846", node: "NODE-IN-MH-003", type: "Contribution", amount: "₹97", time: "12 min ago" },
  { tx: "TX-9845", node: "NODE-IN-MH-007", type: "Distribution", amount: "₹485", time: "18 min ago" },
  { tx: "TX-9844", node: "NODE-IN-MH-012", type: "Assignment", amount: "—", time: "22 min ago" },
  { tx: "TX-9843", node: "NODE-IN-MH-001", type: "Order", amount: "₹2,100", time: "28 min ago" },
  { tx: "TX-9842", node: "NODE-IN-MH-009", type: "Contribution", amount: "₹126", time: "35 min ago" },
  { tx: "TX-9841", node: "SYSTEM", type: "Rule Change", amount: "—", time: "1 hr ago" },
  { tx: "TX-9840", node: "NODE-IN-MH-005", type: "Distribution", amount: "₹340", time: "1 hr ago" },
];

const typeColors: Record<string, string> = {
  Order: "text-primary",
  Contribution: "text-warning",
  Distribution: "text-success",
  Assignment: "text-muted-foreground",
  "Rule Change": "text-destructive",
};

export default function NetworkLedger() {
  return (
    <div>
      <PageHeader title="Shared Ledger" description="Transparent transaction record" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">All members can view ledger · Data from shared ledger</p>

      <div className="bg-card border rounded-lg animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledgerEntries.map((e) => (
              <TableRow key={e.tx}>
                <TableCell className="font-medium text-sm font-mono">{e.tx}</TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{e.node}</TableCell>
                <TableCell className={`text-sm font-medium ${typeColors[e.type] || ""}`}>{e.type}</TableCell>
                <TableCell className="text-sm tabular-nums">{e.amount}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Transaction recorded in ledger · No central owner · All members share access</p>
    </div>
  );
}
