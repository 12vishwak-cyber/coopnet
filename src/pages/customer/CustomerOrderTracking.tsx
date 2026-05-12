import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Star,
  Truck,
  User,
  Phone,
  MessageCircle,
  Package,
  MapPin,
  Bike,
  Hourglass,
  Coins,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LiveMap from "@/components/LiveMap";
import DisputeButton from "@/components/DisputeButton";
import {
  useLiveOrder,
  STATUS_FLOW,
  STATUS_LABELS,
  setWaitPenalty,
  type DbOrder,
} from "@/lib/coopnet-api";

const WAIT_GRACE_S = 180;
const WAIT_RATE = 5; // ₹/min after grace, paid 100% to driver

function timeLabel(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function statusToProgress(status: DbOrder["status"]): number {
  // How far the driver pin should be along the route.
  if (status === "out_for_delivery") return 0.55;
  if (status === "arrived") return 1;
  if (status === "delivered") return 1;
  if (status === "assigned") return 0.05;
  return 0;
}

export default function CustomerOrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { order, events, seller, driver } = useLiveOrder(id);
  const [progress, setProgress] = useState(0);

  // Smoothly animate the driver pin while out_for_delivery.
  useEffect(() => {
    if (!order) return;
    const target = statusToProgress(order.status);
    setProgress(target * 0.4); // start partway
    if (order.status !== "out_for_delivery") {
      setProgress(target);
      return;
    }
    let p = 0.1;
    const iv = setInterval(() => {
      p = Math.min(0.95, p + 0.01);
      setProgress(p);
    }, 800);
    return () => clearInterval(iv);
  }, [order?.status, order?.id]);

  // Wait-penalty engine.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const arrivedTs = order?.arrived_at ? new Date(order.arrived_at).getTime() : null;
  const waitElapsed = arrivedTs ? Math.floor((now - arrivedTs) / 1000) : 0;
  const overGrace = Math.max(0, waitElapsed - WAIT_GRACE_S);
  const accruedPenalty = Math.ceil((overGrace / 60) * WAIT_RATE);

  // Persist penalty back to DB (driver app reads it too).
  useEffect(() => {
    if (!order || !arrivedTs) return;
    if (order.wait_penalty !== accruedPenalty) {
      setWaitPenalty(order.id, accruedPenalty).catch(() => {});
    }
  }, [accruedPenalty, arrivedTs, order]);

  // Auto-redirect to impact screen on delivery.
  useEffect(() => {
    if (order?.status === "delivered") {
      const t = setTimeout(() => navigate(`/customer/order/impact/${order.id}`), 2_500);
      return () => clearTimeout(t);
    }
  }, [order?.status, order?.id, navigate]);

  if (!order || !seller) {
    return (
      <div className="min-h-screen bg-surface text-foreground p-4 space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const stageIdx = STATUS_FLOW.indexOf(order.status);
  const stopsAhead = order.status === "out_for_delivery" ? Math.max(0, Math.round((1 - progress) * 3)) : 0;
  const liveLine =
    order.status === "placed"
      ? "Sent to seller — confirming…"
      : order.status === "packed"
      ? `Packed by ${seller.name}`
      : order.status === "assigned"
      ? `${driver?.name ?? "Driver"} accepted — heading to pickup`
      : order.status === "out_for_delivery"
      ? stopsAhead > 0
        ? `${stopsAhead} ${stopsAhead === 1 ? "stop" : "stops"} before you`
        : "Arriving at your doorstep"
      : order.status === "arrived"
      ? "Driver arrived — please collect"
      : "Delivered ✓";

  const etaMin =
    order.status === "delivered" || order.status === "arrived"
      ? 0
      : order.status === "out_for_delivery"
      ? Math.max(2, Math.round((1 - progress) * 14))
      : Math.max(8, Math.round(order.distance_km * 6 + 6));

  return (
    <div className="min-h-screen bg-surface text-foreground pb-6">
      {/* Header */}
      <div className="bg-card px-4 py-3 flex items-center gap-3 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-bold text-foreground truncate">Order Tracking</h1>
          <p className="text-[11px] text-muted-foreground truncate">
            {order.short_code} · {liveLine}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 rounded-full px-2.5 py-1">
          {etaMin > 0 ? `~${etaMin} min` : "Arrived"}
        </span>
        <DisputeButton orderRef={order.short_code} variant="icon" />
      </div>

      <div className="p-4 space-y-3">
        {/* Live map */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
          <LiveMap
            seller={{ lat: seller.lat, lng: seller.lng, label: seller.name }}
            customer={{ lat: order.customer_lat, lng: order.customer_lng, label: order.customer_address }}
            driver={
              driver
                ? { lat: driver.current_lat, lng: driver.current_lng, label: driver.name }
                : null
            }
            routeProgress={progress}
            className="h-64 w-full"
          />
          <div className="px-4 py-2.5 flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">⚡ {liveLine}</span>
            <span className="text-muted-foreground">{order.distance_km} km route</span>
          </div>
        </div>

        {/* Driver card */}
        {driver && (
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-foreground truncate">{driver.name}</p>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                    <Bike className="h-3 w-3" /> {driver.vehicle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {driver.rating}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Earning ₹{order.driver_earnings + (order.wait_penalty || 0)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center"
                  aria-label="Call driver"
                >
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </button>
                <button
                  className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"
                  aria-label="Message driver"
                >
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Driver earnings transparency */}
        {driver && (
          <div className="bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl p-3.5 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[12px] font-extrabold text-emerald-800 dark:text-emerald-200">
                How {driver.name.split(" ")[0]} is paid
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <PayPill label="Base" value="₹20" />
              <PayPill label={`${order.distance_km}km × ₹12`} value={`₹${Math.round(order.distance_km * 12)}`} />
              <PayPill label="To driver" value={`₹${order.driver_earnings + (order.wait_penalty || 0)}`} highlight />
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-2 leading-relaxed">
              100% of delivery fee goes to {driver.name.split(" ")[0]} — CoopNet does not skim driver pay.
            </p>
          </div>
        )}

        {/* Live timeline */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Live Status</h3>
          <div className="space-y-0">
            {STATUS_FLOW.filter((s) => s !== "arrived").map((stage, i) => {
              // We collapse "arrived" into "out_for_delivery" for the timeline.
              const ev = events.find((e) => e.status === stage);
              const compareIdx = STATUS_FLOW.indexOf(stage);
              const myIdx = STATUS_FLOW.indexOf(order.status);
              const done = myIdx > compareIdx;
              const isCurrent =
                myIdx === compareIdx ||
                (stage === "out_for_delivery" && order.status === "arrived");
              const Icon =
                stage === "out_for_delivery"
                  ? Truck
                  : stage === "delivered"
                  ? MapPin
                  : stage === "packed"
                  ? Package
                  : Check;
              return (
                <div key={stage} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                        done
                          ? "bg-emerald-500"
                          : isCurrent
                          ? "bg-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/40"
                          : "bg-muted"
                      }`}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5 text-white" />
                      ) : isCurrent ? (
                        <Icon className="h-3 w-3 text-white" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                      )}
                    </div>
                    {i < 4 && <div className={`w-0.5 h-7 ${done ? "bg-emerald-500/30" : "bg-muted"}`} />}
                  </div>
                  <div className="-mt-0.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm ${
                          done || isCurrent
                            ? "font-bold text-foreground"
                            : "text-muted-foreground font-medium"
                        }`}
                      >
                        {STATUS_LABELS[stage]}
                      </p>
                      {ev && (
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {timeLabel(new Date(ev.created_at))}
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {ev?.message ?? (isCurrent ? "In progress…" : "Waiting")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wait penalty warning */}
        {order.arrived_at && order.status !== "delivered" && (
          <CustomerWaitWarning arrivedAt={order.arrived_at} penalty={accruedPenalty} />
        )}

        {/* Why this driver — DB-backed */}
        {order.assignment_reason && driver && (
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-bold text-foreground">Why {driver.name.split(" ")[0]}?</p>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              {order.assignment_reason.explanation}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Factor
                label="Distance"
                value={`${order.assignment_reason.distance} km`}
                hint="Closest match"
              />
              <Factor
                label="Rating"
                value={`${order.assignment_reason.rating}★`}
                hint="Customer reviews"
              />
              <Factor
                label="Co-op rotation"
                value={`${order.assignment_reason.idleHours.toFixed(1)}h idle`}
                hint="Fair earnings spread"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Picked from {order.assignment_reason.considered} available drivers — no surge pricing.
            </p>
          </div>
        )}

        <Button
          className="w-full h-12 rounded-2xl font-bold bg-gray-900 hover:bg-gray-800 text-white"
          onClick={() => navigate(`/customer/order/impact/${order.id}`)}
        >
          {order.status === "delivered" ? "View Impact" : "Skip to Impact Preview"}
        </Button>
      </div>
    </div>
  );
}

function PayPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl p-2 ${
        highlight ? "bg-emerald-500 text-white" : "bg-card border border-emerald-500/30"
      }`}
    >
      <p className={`text-[9px] font-medium ${highlight ? "opacity-90" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p
        className={`text-sm font-extrabold ${
          highlight ? "" : "text-emerald-700 dark:text-emerald-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Factor({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-2.5">
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-[13px] font-extrabold text-foreground">{value}</p>
      <p className="text-[9px] text-muted-foreground mt-0.5">{hint}</p>
    </div>
  );
}

function CustomerWaitWarning({ arrivedAt, penalty }: { arrivedAt: string; penalty: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const elapsed = Math.floor((now - new Date(arrivedAt).getTime()) / 1000);
  const remaining = Math.max(0, WAIT_GRACE_S - elapsed);
  const inGrace = remaining > 0;
  const m = Math.floor(remaining / 60);
  const s = (remaining % 60).toString().padStart(2, "0");

  return (
    <div
      className={`rounded-2xl border-2 p-3.5 ${
        inGrace
          ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/40"
          : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            inGrace ? "bg-amber-100 dark:bg-amber-500/20" : "bg-rose-100 dark:bg-rose-500/20"
          }`}
        >
          <Hourglass className={`h-5 w-5 ${inGrace ? "text-amber-700 dark:text-amber-300" : "text-rose-700 dark:text-rose-300"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[13px] font-extrabold ${
              inGrace ? "text-amber-900 dark:text-amber-200" : "text-rose-900 dark:text-rose-200"
            }`}
          >
            {inGrace
              ? `Driver has arrived — collect within ${m}:${s}`
              : `+₹${penalty} wait charge added`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {inGrace
              ? `Please come down to avoid ₹${WAIT_RATE}/min charge after the 3-minute grace.`
              : `Charged for late pickup — paid 100% to your driver as fair compensation.`}
          </p>
        </div>
      </div>
    </div>
  );
}
