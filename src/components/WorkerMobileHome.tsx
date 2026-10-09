import { Bike, Clock3, IndianRupee, MapPin, Navigation, Route, Timer, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useActiveOrders, assignDriver } from "@/lib/coopnet-api";
import { toast } from "sonner";
import { MobileNetworkShortcuts } from "@/components/MobileNetworkShortcuts";

export default function WorkerMobileHome() {
  const navigate = useNavigate();
  const orders = useActiveOrders();
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const nextOrder = useMemo(() => orders.find((order) => !order.driver_id && (order.status === "packed" || order.status === "placed")) ?? orders[0], [orders]);
  const distance = Number(nextOrder?.distance_km || 3.2);
  const basePay = 20;
  const distancePay = Math.max(5, Math.round(distance * 12));
  const payout = Number(nextOrder?.driver_earnings || basePay + distancePay);

  const accept = async () => {
    if (!nextOrder) return;
    setBusy(true);
    try {
      await assignDriver(nextOrder.id, 12.9756, 77.605);
      toast.success("Order accepted");
      navigate("/worker/delivery");
    } catch {
      toast.error("Couldn’t accept this order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-5">
      <section className="flex items-center justify-between">
        <div><p className="text-sm text-muted-foreground">Good afternoon, Arjun</p><h1 className="mt-1 text-2xl font-bold">Ready to deliver?</h1></div>
        <div className="flex flex-col items-end gap-1"><Switch checked={online} onCheckedChange={setOnline} /><span className={`text-[10px] font-bold ${online ? "text-success" : "text-muted-foreground"}`}>{online ? "ONLINE" : "OFFLINE"}</span></div>
      </section>

      <section className="border-y py-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Today</p>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-3">
          <Metric icon={IndianRupee} value="₹620" label="earned" />
          <Metric icon={Truck} value="12" label="deliveries" />
          <Metric icon={Route} value="38.4 km" label="travelled" />
          <Metric icon={Timer} value="6h 12m" label="working" />
        </div>
      </section>

      <MobileNetworkShortcuts />

      {online && nextOrder ? (
        <section className="rounded-lg border-2 border-primary/30 bg-card p-4">
          <div className="flex items-start justify-between">
            <div><p className="text-xs font-bold uppercase text-primary">Available order</p><p className="mt-1 text-3xl font-bold tabular-nums">₹{payout}</p><p className="text-xs text-muted-foreground">Driver pay</p></div>
            <div className="rounded-lg bg-primary/10 p-2"><Bike className="h-5 w-5 text-primary" /></div>
          </div>
          <div className="mt-4 space-y-2 border-y py-3 text-sm">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> Pickup</span><span className="max-w-[58%] truncate font-medium">Ravi General Store</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Navigation className="h-4 w-4" /> Route</span><span className="font-medium">{distance.toFixed(1)} km</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Clock3 className="h-4 w-4" /> Estimated</span><span className="font-medium">14 min</span></div>
          </div>
          <div className="mt-3 rounded-lg bg-muted/60 p-3 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Base pay</span><span>₹{basePay}</span></div>
            <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Distance component</span><span>₹{distancePay}</span></div>
            <p className="mt-2 text-[10px] text-muted-foreground">Waiting compensation starts after the 3-minute grace period.</p>
          </div>
          <Button className="mt-4 h-12 w-full text-base font-bold" disabled={busy} onClick={accept}>{busy ? "Accepting…" : "Accept order"}</Button>
        </section>
      ) : (
        <section className="rounded-lg border bg-card p-6 text-center"><Truck className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-2 text-sm font-bold">{online ? "No orders available" : "You’re offline"}</p><p className="mt-1 text-xs text-muted-foreground">{online ? "We’ll show the next nearby order here." : "Go online when you’re ready to deliver."}</p></section>
      )}
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Truck; value: string; label: string }) {
  return <div className="flex min-w-0 items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-primary" /><div className="min-w-0"><p className="text-lg font-bold tabular-nums">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></div>;
}