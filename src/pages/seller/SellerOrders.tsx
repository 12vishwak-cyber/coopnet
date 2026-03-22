import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";

const orders = [
  { id: "ORD-1850", customer: "Meera J.", items: "Rice 5kg, Dal 1kg, Oil 1L", total: "₹1,620", status: "pending", time: "5 min ago", address: "Sector 12, Block C" },
  { id: "ORD-1849", customer: "Suresh P.", items: "Flour 2kg, Sugar 1kg", total: "₹480", status: "pending", time: "18 min ago", address: "MG Road, Shop 4" },
  { id: "ORD-1848", customer: "Kavita D.", items: "Detergent, Soap x3", total: "₹320", status: "active", time: "32 min ago", address: "Anand Nagar, H-14" },
  { id: "ORD-1847", customer: "Priya M.", items: "Mixed groceries (3)", total: "₹1,240", status: "active", time: "45 min ago", address: "Gandhi Chowk" },
  { id: "ORD-1846", customer: "Ravi K.", items: "Cooking Oil 2L", total: "₹380", status: "completed", time: "1 hr ago", address: "Station Road" },
  { id: "ORD-1845", customer: "Anita S.", items: "Bulk order (5 items)", total: "₹2,100", status: "completed", time: "2 hr ago", address: "Civil Lines" },
];

export default function SellerOrders() {
  return (
    <div>
      <PageHeader title="Orders" description="Manage incoming and active orders" />
      <div className="bg-card border rounded-lg animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium text-sm">{o.id}</TableCell>
                <TableCell className="text-sm">{o.customer}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{o.items}</TableCell>
                <TableCell className="text-sm">{o.total}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">{o.address}</TableCell>
                <TableCell><StatusBadge status={o.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{o.time}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {o.status === "pending" && (
                      <>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success hover:text-success"><Check className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive"><X className="h-3.5 w-3.5" /></Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
