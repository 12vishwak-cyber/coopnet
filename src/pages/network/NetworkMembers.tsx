import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Shield, Vote } from "lucide-react";

const members = [
  { id: "COOP-00482", role: "Seller", type: "Seller Member", joined: "Mar 2025", voting: true, status: "active" },
  { id: "COOP-00415", role: "Worker", type: "Worker Member", joined: "Jan 2025", voting: true, status: "active" },
  { id: "COOP-00390", role: "Governance", type: "Governance Member", joined: "Dec 2024", voting: true, status: "active" },
  { id: "COOP-00312", role: "Admin", type: "Admin Member", joined: "Oct 2024", voting: true, status: "active" },
  { id: "COOP-00298", role: "Auditor", type: "Auditor", joined: "Sep 2024", voting: true, status: "active" },
  { id: "COOP-00510", role: "Seller", type: "Seller Member", joined: "Apr 2025", voting: false, status: "pending" },
  { id: "COOP-00503", role: "Worker", type: "Worker Member", joined: "Apr 2025", voting: true, status: "active" },
  { id: "COOP-00488", role: "Seller", type: "Seller Member", joined: "Mar 2025", voting: true, status: "active" },
];

export default function NetworkMembers() {
  return (
    <div>
      <PageHeader title="Members" description="Cooperative network members and voting rights" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">
        Only members can vote · Sellers and workers automatically become members
      </p>

      <div className="bg-card border rounded-lg animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Voting Rights</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(m => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-sm">{m.id}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm">
                    {m.role === "Governance" || m.role === "Admin" ? <Shield className="h-3 w-3 text-primary" /> : <Globe className="h-3 w-3 text-muted-foreground" />}
                    {m.role}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.joined}</TableCell>
                <TableCell>
                  {m.voting ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium"><Vote className="h-3 w-3" /> Active</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </TableCell>
                <TableCell><StatusBadge status={m.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-accent/30 border border-primary/10 rounded-lg p-4 mt-4 animate-fade-up stagger-2">
        <p className="text-xs font-medium mb-1">Membership Rules</p>
        <p className="text-[11px] text-muted-foreground">
          Each member has one vote · Additional governance members approved by voting · No company ownership
        </p>
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">
        System governed by cooperative · All members share access to ledger
      </p>
    </div>
  );
}
