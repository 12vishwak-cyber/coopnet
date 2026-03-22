import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  active: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  "in-transit": "bg-primary/10 text-primary border-primary/20",
  "picked-up": "bg-success/10 text-success border-success/20",
  assigned: "bg-primary/10 text-primary border-primary/20",
  available: "bg-success/10 text-success border-success/20",
  low: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium capitalize ${statusStyles[status] || ""}`}>
      {status}
    </Badge>
  );
}
