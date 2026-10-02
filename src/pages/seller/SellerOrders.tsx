import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Eye, Package } from "lucide-react";
import { useSellerOrders, advanceOrder, STATUS_LABELS } from "@/lib/coopnet-api";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import SellerChat from "@/components/SellerChat";
import type { DbOrder } from "@/lib/coopnet-api";
import { toast } from "sonner";

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
  const [selected, setSelected] = useState<DbOrder | null>(null);

  const handlePack = async (id: string) => {
    setBusy(id);
    try {
      await advanceOrder(id, "packed", "Packed and ready for pickup", "seller");
    } finally {
      setBusy(null);
    }
  };

  const updateOrder = async (order: DbOrder, status: DbOrder["status"], message: string) => {
    setBusy(order.id);
    try {
      await advanceOrder(order.id, status, message, "seller");
      toast.success(message);
      setSelected(null);
    } catch {
      toast.error("Couldn’t update this order");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="md:hidden">
        <div className="mb-5"><p className="text-xs text-muted-foreground">Live storefront</p><h1 className="text-2xl font-bold">Orders</h1></div>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center"><Package className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-2 text-sm font-bold">No orders yet</p><p className="mt-1 text-xs text-muted-foreground">New orders appear here instantly.</p></div>
          ) : orders.map((order) => (
            <button key={order.id} onClick={() => setSelected(order)} className="w-full rounded-lg border bg-card p-4 text-left">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{order.short_code}</p><p className="text-xs text-muted-foreground">{order.customer_name} · {order.items.length} items</p></div><StatusBadge status={STATUS_LABELS[order.status].toLowerCase().replace(/\s+/g, "-")} /></div>
              <div className="mt-4 flex items-end justify-between"><div><p className="text-lg font-bold">₹{Number(order.total).toFixed(0)}</p><p className="text-[10px] text-muted-foreground">Prepare by {new Date(new Date(order.created_at).getTime() + 8 * 60000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p></div><span className="text-xs font-semibold text-primary">View order</span></div>
            </button>
          ))}
        </div>
        <Drawer open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <DrawerContent className="max-h-[88svh]">
            {selected && <div className="overflow-y-auto px-4 pb-6">
              <DrawerHeader className="px-0 text-left"><DrawerTitle>{selected.short_code}</DrawerTitle><DrawerDescription>{selected.customer_name} · {STATUS_LABELS[selected.status]}</DrawerDescription></DrawerHeader>
              <div className="space-y-2 rounded-lg border p-3">{selected.items.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.name} × {item.qty}</span><span className="font-medium">₹{Number(item.price * item.qty).toFixed(0)}</span></div>)}<div className="flex justify-between border-t pt-2 text-sm font-bold"><span>Total</span><span>₹{Number(selected.total).toFixed(0)}</span></div></div>
              <div className="mt-4"><SellerChat sellerId={ACTING_SELLER_ID} sellerName={selected.customer_name} perspective="seller" /></div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {selected.status === "placed" && <><Button variant="outline" className="h-12" disabled={busy === selected.id} onClick={() => updateOrder(selected, "cancelled", "Order declined")}>Reject</Button><Button className="h-12" disabled={busy === selected.id} onClick={() => updateOrder(selected, "packed", "Order accepted and prepared")}>Accept & prepare</Button></>}
                {selected.status === "packed" && <Button className="col-span-2 h-12" disabled>Ready for driver pickup</Button>}
                {!["placed", "packed", "cancelled", "delivered"].includes(selected.status) && <Button className="col-span-2 h-12" variant="outline" disabled>{STATUS_LABELS[selected.status]}</Button>}
              </div>
            </div>}
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden md:block">
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
    </div>
  );
}
