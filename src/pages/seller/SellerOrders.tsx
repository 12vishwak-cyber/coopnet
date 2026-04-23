import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Eye, Package } from "lucide-react";
import { useSellerOrders, advanceOrder, STATUS_LABELS } from "@/lib/coopnet-api";
import { useState } from "react";

// Demo seller identity — in a real auth flow this would come from the session.
const ACTING_SELLER_ID = "s1";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return new Date(iso).toLocaleDateString();
}

export default function SellerOrders() {
  const orders = useSellerOrders(ACTING_SELLER_ID);
  const [busy, setBusy] = useState<string | null>(null);

  const handlePack = async (id: string) => {
    setBusy(id);
    try {
      await advanceOrder(id, "packed", "Packed and ready for pickup", "seller");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageHeader title="Orders" description="Live orders from your storefront" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">
        Realtime feed · Updates instantly when customers place or drivers progress orders
      </p>

      {orders.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center animate-fade-up">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-bold">No orders yet</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            New orders from customers will appear here in realtime.
          </p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg animate-fade-up stagger-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-sm">{o.short_code}</TableCell>
                  <TableCell className="text-sm">{o.customer_name}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">
                    {o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">₹{Number(o.total).toFixed(0)}</TableCell>
                  <TableCell className="text-sm tabular-nums text-muted-foreground">{o.distance_km} km</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    {o.driver_id ? "Assigned" : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={STATUS_LABELS[o.status].toLowerCase().replace(/\s+/g, "-")} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{timeAgo(o.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {o.status === "placed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-success hover:text-success"
                          disabled={busy === o.id}
                          onClick={() => handlePack(o.id)}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Pack
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <p className="text-[10px] text-muted-foreground mt-3">
        Live orders synced via shared ledger · {orders.length} total
      </p>
    </div>
  );
}
