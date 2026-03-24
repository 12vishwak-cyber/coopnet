import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rules = [
  { name: "Contribution Rate", value: "6% of gross earnings", status: "active", lastUpdated: "2 months ago" },
  { name: "Assignment Logic", value: "Proximity + load balance + rating", status: "active", lastUpdated: "3 months ago" },
  { name: "Routing Rule", value: "Multi-stop optimization, fuel-aware", status: "active", lastUpdated: "1 month ago" },
  { name: "Distribution Rule", value: "60% routing, 25% intelligence, 15% reserve", status: "active", lastUpdated: "4 months ago" },
  { name: "Penalty Rule", value: "3 missed deliveries = 24hr cooldown", status: "active", lastUpdated: "6 months ago" },
  { name: "Increase contribution to 7%", value: "Proposed by Node-IN-MH-003", status: "proposed", lastUpdated: "2 days ago" },
  { name: "Priority routing for high-volume sellers", value: "Proposed by Node-IN-MH-012", status: "proposed", lastUpdated: "5 days ago" },
  { name: "Weekend surge multiplier 1.2x", value: "Under member vote — 62% approved", status: "pending", lastUpdated: "1 day ago" },
];

export default function NetworkRules() {
  return (
    <div>
      <PageHeader title="Network Rules" description="Cooperative governance rules and proposals" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">Rules decided by cooperative · All members can propose changes</p>

      <div className="bg-card border rounded-lg animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="font-medium text-sm">{r.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[300px]">{r.value}</TableCell>
                <TableCell><StatusBadge status={r.status === "proposed" ? "pending" : r.status === "pending" ? "assigned" : r.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">Rules decided by cooperative · System governed by cooperative</p>
    </div>
  );
}
