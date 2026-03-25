import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Plus, X } from "lucide-react";

const complaints = [
  { id: "CMP-041", type: "Delivery Issue", desc: "Order delivered to wrong address", date: "Mar 24, 2025", status: "pending" },
  { id: "CMP-040", type: "Payment Issue", desc: "Contribution deducted twice for ORD-1190", date: "Mar 22, 2025", status: "under-review" },
  { id: "CMP-038", type: "Worker Dispute", desc: "Unfair assignment priority score", date: "Mar 18, 2025", status: "resolved" },
  { id: "CMP-036", type: "Rule Violation", desc: "Seller not following minimum packaging rule", date: "Mar 15, 2025", status: "resolved" },
  { id: "CMP-035", type: "Seller Dispute", desc: "Inventory data not syncing to network", date: "Mar 12, 2025", status: "rejected" },
];

export default function NetworkComplaints() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader title="Complaints" description="Dispute resolution and issue tracking" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">
        Complaints reviewed by cooperative committee · No central authority
      </p>

      <div className="flex items-center justify-between mb-4 animate-fade-up">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{complaints.filter(c => c.status === "pending" || c.status === "under-review").length} open complaints</span>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="h-3 w-3 mr-1" /> Cancel</> : <><Plus className="h-3 w-3 mr-1" /> New Complaint</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-lg p-5 mb-4 animate-fade-up space-y-3">
          <h3 className="text-sm font-semibold">Submit Complaint</h3>
          <Select>
            <SelectTrigger className="h-10"><SelectValue placeholder="Complaint Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="worker">Worker Dispute</SelectItem>
              <SelectItem value="seller">Seller Dispute</SelectItem>
              <SelectItem value="payment">Payment Issue</SelectItem>
              <SelectItem value="rule">Rule Violation</SelectItem>
              <SelectItem value="delivery">Delivery Issue</SelectItem>
              <SelectItem value="other">Member Complaint</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Describe the issue..." className="min-h-[80px]" />
          <Input type="file" className="h-10 text-xs" />
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-8">Submit</Button>
            <Button size="sm" variant="ghost" className="text-xs h-8" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
          <p className="text-[10px] text-muted-foreground">Reviewed by cooperative committee · Resolution logged in ledger</p>
        </div>
      )}

      <div className="bg-card border rounded-lg animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-sm">{c.id}</TableCell>
                <TableCell className="text-sm">{c.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{c.desc}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                <TableCell><StatusBadge status={c.status === "under-review" ? "in-transit" : c.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">
        All resolutions logged in shared ledger · System governed by cooperative
      </p>
    </div>
  );
}
