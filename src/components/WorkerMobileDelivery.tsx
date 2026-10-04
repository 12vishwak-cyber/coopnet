import { ArrowLeft, Check, Info, MapPin, Navigation, Package, Phone, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveMap from "@/components/LiveMap";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { advanceOrder, STATUS_LABELS, useActiveOrders } from "@/lib/coopnet-api";
import { toast } from "sonner";

export default function WorkerMobileDelivery() {
  const navigate = useNavigate();
  const orders = useActiveOrders();
  const order = useMemo(() => orders.find((item) => item.driver_id) ?? orders[0], [orders]);
  const [driveMode, setDriveMode] = useState(true);
  const [details, setDetails] = useState(false);
  const [busy, setBusy] = useState(false);
  const [atPickup, setAtPickup] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<(typeof orders)[number] | null>(null);
  const currentOrder = order ?? completedOrder;

  if (!currentOrder) {
    return <div className="mx-auto max-w-md py-12 text-center"><Package className="mx-auto h-9 w-9 text-muted-foreground" /><h1 className="mt-3 text-lg font-bold">No active delivery</h1><p className="mt-1 text-sm text-muted-foreground">Accept an order to begin.</p><Button className="mt-5" onClick={() => navigate("/worker/tasks")}>Find orders</Button></div>;
  }

  const order = currentOrder;

  const pickupStage = order.status === "assigned" || order.status === "packed" || order.status === "placed";
  const goingToPickup = order.status === "assigned" && !atPickup;
  const goingToCustomer = order.status === "out_for_delivery";
  const arrived = order.status === "arrived";
  const distance = Number(order.distance_km || 2.4);
  const eta = Math.max(4, Math.round(distance * 4));
  const destination = goingToPickup ? "Pickup at Ravi General Store" : atPickup ? "You’re at pickup" : goingToCustomer ? "Delivering to customer" : arrived ? "You’re at the customer’s location" : "Delivery complete";

  const advance = async () => {
    setBusy(true);
    try {
      if (goingToPickup) {
        setAtPickup(true);
        toast.success("Pickup location reached");
        return;
      }
      if (atPickup) await advanceOrder(order.id, "out_for_delivery", "Order picked up — heading to customer", "driver");
      else if (goingToCustomer) await advanceOrder(order.id, "arrived", "Driver arrived at customer location", "driver");
      else if (arrived) {
        setCompletedOrder({ ...order, status: "delivered" });
        await advanceOrder(order.id, "delivered", "Delivery completed", "driver");
      }
      toast.success(atPickup ? "Pickup confirmed" : goingToCustomer ? "Arrival confirmed" : "Delivery complete");
    } catch {
      toast.error("Couldn’t update delivery");
    } finally {
      setBusy(false);
    }
  };

  if (!driveMode) {
    return <div className="mx-auto max-w-md space-y-4"><div><p className="text-xs text-muted-foreground">Active delivery</p><h1 className="text-2xl font-bold">{order.short_code}</h1></div><div className="overflow-hidden rounded-lg border bg-card"><LiveMap seller={{ lat: 12.9756, lng: 77.605, label: "Pickup" }} customer={{ lat: order.customer_lat, lng: order.customer_lng, label: "Drop" }} routeProgress={goingToCustomer ? 0.55 : 0.08} mode="preview" className="aspect-[4/3] w-full" /></div><div className="rounded-lg border bg-card p-4"><p className="text-sm font-bold">{destination}</p><p className="mt-1 text-xs text-muted-foreground">{distance.toFixed(1)} km · about {eta} min</p><Button className="mt-4 h-12 w-full" onClick={() => setDriveMode(true)}><Navigation className="mr-2 h-4 w-4" /> Enter Drive Mode</Button></div></div>;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-background md:hidden">
      <LiveMap seller={{ lat: 12.9756, lng: 77.605, label: "Pickup" }} customer={{ lat: order.customer_lat, lng: order.customer_lng, label: "Drop" }} routeProgress={goingToCustomer ? 0.55 : arrived ? 0.95 : 0.08} mode="driver" interactive={false} className="h-full w-full" />
      <Button variant="outline" size="icon" className="absolute left-4 top-4 h-12 w-12 rounded-full bg-card/95 shadow-lg" onClick={() => setDriveMode(false)} aria-label="Exit Drive Mode"><ArrowLeft className="h-5 w-5" /></Button>
      <div className="absolute left-20 right-4 top-4 rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur">
        <p className="truncate text-xs font-bold">{destination}</p>
        <div className="mt-1 flex items-end justify-between"><p className="text-2xl font-bold tabular-nums">{order.status === "delivered" ? "Done" : `${eta} min`}</p><p className="text-xs font-medium text-muted-foreground">{distance.toFixed(1)} km</p></div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 pb-[calc(.75rem+env(safe-area-inset-bottom))]">
        <div className="rounded-lg border bg-card p-3 shadow-xl">
          {order.status === "delivered" ? (
            <div className="text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-success/10"><Check className="h-5 w-5 text-success" /></div><p className="mt-2 text-base font-bold">Delivery complete</p><p className="text-2xl font-bold text-success">₹{Number(order.driver_earnings).toFixed(0)} earned</p><Button className="mt-3 h-12 w-full" onClick={() => navigate("/worker/tasks")}>Next order</Button></div>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-3 gap-2">
                <Button asChild variant="outline" className="h-12 flex-col gap-0.5 px-1 text-[10px]"><a href={`https://www.google.com/maps/dir/?api=1&destination=${order.customer_lat},${order.customer_lng}`} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" />Navigation</a></Button>
                <Button asChild variant="outline" className="h-12 flex-col gap-0.5 px-1 text-[10px]"><a href="tel:+910000000000"><Phone className="h-4 w-4" />{pickupStage ? "Call seller" : "Call customer"}</a></Button>
                <Button variant="outline" className="h-12 flex-col gap-0.5 px-1 text-[10px]" onClick={() => setDetails(true)}><Info className="h-4 w-4" />Order details</Button>
              </div>
              <Button className="h-14 w-full text-base font-bold" disabled={busy} onClick={advance}>{busy ? "Updating…" : goingToPickup ? "I’m at pickup" : atPickup ? "Confirm pickup" : goingToCustomer ? "I’ve arrived" : "Complete delivery"}</Button>
            </>
          )}
        </div>
      </div>

      <Drawer open={details} onOpenChange={setDetails}>
        <DrawerContent><div className="px-4 pb-6"><DrawerHeader className="px-0 text-left"><DrawerTitle>{order.short_code}</DrawerTitle><DrawerDescription>{STATUS_LABELS[order.status]} · {order.items.length} items</DrawerDescription></DrawerHeader><div className="space-y-2">{order.items.map((item) => <div key={item.id} className="flex justify-between border-b py-2 text-sm"><span>{item.name} × {item.qty}</span><span>₹{Number(item.price * item.qty).toFixed(0)}</span></div>)}</div><Button variant="outline" className="mt-4 h-12 w-full" onClick={() => setDetails(false)}><X className="mr-2 h-4 w-4" /> Close</Button></div></DrawerContent>
      </Drawer>
    </div>
  );
}