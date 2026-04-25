import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Check,
  Package,
  Truck,
  MapPin,
  Clock,
  Globe,
  Database,
  BarChart3,
  Navigation,
  Shrink,
  Phone,
  MessageCircle,
  Info,
  Coins,
  Hourglass,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  X,
} from "lucide-react";
import { useOrders } from "@/contexts/OrdersContext";
import LiveMap from "@/components/LiveMap";

// Synthetic fallback when no live order exists.
const fallbackDelivery = {
  id: "TSK-411",
  seller: "Daily Needs",
  pickup: { address: "MG Road, Shop 3", contact: "Rajesh P." },
  delivery: { address: "Sector 12, Block A, H-22", contact: "Meera J." },
  items: ["Rice 5kg", "Dal 1kg", "Oil 1L", "Sugar 500g", "Tea 250g"],
  status: "in-transit" as const,
  distanceKm: 1.8,
  estimatedTime: 14,
};

const statusSteps = [
  { label: "Assigned", icon: Check },
  { label: "Picked Up", icon: Package },
  { label: "In Transit", icon: Truck },
  { label: "Delivered", icon: MapPin },
  { label: "Recorded", icon: Database },
  { label: "Distributed", icon: BarChart3 },
];

const WAIT_GRACE_SECONDS = 180; // 3 min
const PENALTY_PER_MIN = 5; // ₹/min after grace, paid to driver

function fmtMMSS(total: number): string {
  const m = Math.max(0, Math.floor(total / 60));
  const s = Math.max(0, total % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WorkerDelivery() {
  const { activeOrder, markArrived, confirmPickup, tickWaitPenalty } = useOrders();
  const [driveMode, setDriveMode] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef<number | null>(null);

  // 1Hz tick for the wait clock display.
  useEffect(() => {
    tickRef.current = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  // Bind to live order if available, else show synthetic preview.
  const live = activeOrder;
  const id = live?.id ?? fallbackDelivery.id;
  const seller = live?.seller ?? fallbackDelivery.seller;
  const distanceKm = live?.distanceKm ?? fallbackDelivery.distanceKm;
  const eta = live?.etaMin ?? fallbackDelivery.estimatedTime;
  const liveStatus = live?.status ?? "Out for Delivery";
  const items = live?.items.map((i) => `${i.name} ×${i.qty}`) ?? fallbackDelivery.items;

  // Earnings transparency derived from live order or pricing rule.
  const baseFare = live?.worker.baseFare ?? 20;
  const perKmRate = live?.worker.perKmRate ?? 12;
  const totalEarnings = live?.worker.earnings ?? Math.max(25, Math.round(baseFare + distanceKm * perKmRate));

  // Wait penalty engine (driver-arrived → 3-min grace → ₹5/min ticking)
  const arrivedAt = live?.arrivedAt ? new Date(live.arrivedAt).getTime() : null;
  const waitElapsed = arrivedAt ? Math.floor((now - arrivedAt) / 1000) : 0;
  const overGrace = Math.max(0, waitElapsed - WAIT_GRACE_SECONDS);
  const accruedPenalty = Math.ceil((overGrace / 60) * PENALTY_PER_MIN);
  const graceRemaining = Math.max(0, WAIT_GRACE_SECONDS - waitElapsed);

  // Persist penalty into order whenever it changes.
  useEffect(() => {
    if (!live || !arrivedAt) return;
    if ((live.waitPenalty ?? 0) !== accruedPenalty) {
      tickWaitPenalty(live.id, accruedPenalty);
    }
  }, [accruedPenalty, arrivedAt, live, tickWaitPenalty]);

  // Map: a single driver pin moves toward customer when In Transit.
  const driverProgress = useMemo(() => {
    if (!live) return 0.55;
    if (live.status === "Delivered") return 1;
    if (live.status === "Out for Delivery") return Math.min(0.95, 0.1 + live.workerProgress * 0.85);
    return 0.05;
  }, [live]);

  const handleArrive = () => {
    if (live && !live.arrivedAt) markArrived(live.id);
  };

  const handleConfirm = () => {
    if (live) confirmPickup(live.id);
    setDriveMode(false);
  };

  return (
    <div>
      {!driveMode && (
        <PageHeader title="Delivery" description="Active delivery details" />
      )}

      <div className={driveMode ? "fixed inset-0 z-50 bg-background" : "max-w-3xl"}>
        {/* === DRIVE MODE FULL-SCREEN MAP === */}
        {driveMode ? (
          <div className="relative h-full w-full">
            <DeliveryMap progress={driverProgress} large />

            {/* Top floating bar: exit + ETA */}
            <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={() => setDriveMode(false)}
                className="h-11 w-11 rounded-full bg-background/95 backdrop-blur shadow-md border flex items-center justify-center"
                aria-label="Exit drive mode"
              >
                <Shrink className="h-5 w-5" />
              </button>
              <div className="flex-1 bg-background/95 backdrop-blur rounded-full shadow-md border px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold tabular-nums">{eta} min</span>
                </div>
                <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                  → {live?.items[0]?.seller ? "Doorstep" : fallbackDelivery.delivery.address}
                </span>
              </div>
            </div>

            {/* Turn-by-turn card */}
            <div className="absolute top-20 left-3 right-3 z-10">
              <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
                  {arrivedAt ? <MapPin className="h-6 w-6" /> : <CornerUpRight className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">
                    {arrivedAt ? "You have arrived" : "In 200 m"}
                  </p>
                  <p className="text-base font-extrabold leading-tight truncate">
                    {arrivedAt ? "Hand over the order" : "Turn right onto Sector 12 Rd"}
                  </p>
                </div>
              </div>
            </div>

            {/* Wait timer banner — appears once arrived */}
            {arrivedAt && (
              <div className="absolute top-40 left-3 right-3 z-10">
                <WaitTimerCard
                  graceRemaining={graceRemaining}
                  waitElapsed={waitElapsed}
                  penalty={accruedPenalty}
                  compact
                />
              </div>
            )}

            {/* Bottom floating compact panel */}
            <div className="absolute bottom-0 inset-x-0 z-10 p-3">
              <div className="bg-card border rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Order</p>
                    <p className="text-sm font-extrabold">{id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">Earnings</p>
                    <button
                      onClick={() => setShowEarnings(true)}
                      className="text-sm font-extrabold text-success inline-flex items-center gap-1"
                    >
                      ₹{totalEarnings + accruedPenalty}
                      <Info className="h-3 w-3 opacity-60" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!arrivedAt ? (
                    <Button className="flex-1 h-11" onClick={handleArrive}>
                      <MapPin className="h-4 w-4 mr-1.5" /> I've Arrived
                    </Button>
                  ) : (
                    <Button className="flex-1 h-11" onClick={handleConfirm}>
                      <Check className="h-4 w-4 mr-1.5" /> Confirm Handover
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="h-11 w-11">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {showEarnings && (
              <EarningsPopover
                onClose={() => setShowEarnings(false)}
                distanceKm={distanceKm}
                baseFare={baseFare}
                perKmRate={perKmRate}
                penalty={accruedPenalty}
                total={totalEarnings + accruedPenalty}
              />
            )}
          </div>
        ) : (
          <>
            {/* === STANDARD DASHBOARD VIEW === */}
            <div className="bg-card border rounded-lg p-5 mb-6 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold">{id}</p>
                  <p className="text-[11px] text-muted-foreground">{seller}</p>
                </div>
                <StatusBadge status={liveStatus.toLowerCase().replace(/\s+/g, "-")} />
              </div>

              {/* Map preview + Drive Mode CTA */}
              <div className="relative rounded-xl overflow-hidden border mb-4">
                <DeliveryMap progress={driverProgress} />
                <button
                  onClick={() => setDriveMode(true)}
                  className="absolute top-3 right-3 bg-background/95 backdrop-blur shadow-md border rounded-full px-3 py-2 flex items-center gap-1.5 text-xs font-bold hover:bg-background"
                >
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  Drive Mode
                </button>
                <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur rounded-lg px-2.5 py-1 text-[11px] font-semibold border">
                  {distanceKm} km · ~{eta} min
                </div>
              </div>

              {/* Status pills */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {statusSteps.map((step, i) => {
                  const done = i <= 2;
                  return (
                    <div key={step.label} className="flex items-center gap-1.5">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                          done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <step.icon className="h-3 w-3" />
                      </div>
                      <span className={`text-[10px] ${done ? "font-medium" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                      {i < statusSteps.length - 1 && (
                        <div className={`h-px w-3 ${done ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Earnings transparency card */}
              <button
                onClick={() => setShowEarnings(true)}
                className="w-full text-left rounded-xl border bg-success/5 border-success/20 p-3 mb-4 hover:bg-success/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-success/15 flex items-center justify-center">
                      <Coins className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold">Trip earnings · ₹{totalEarnings + accruedPenalty}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Tap to see how this is calculated
                      </p>
                    </div>
                  </div>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="border rounded-lg p-3">
                  <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                    <Package className="h-3 w-3" /> Pickup
                  </p>
                  <p className="text-sm font-medium">{live?.items[0]?.seller ?? fallbackDelivery.pickup.address}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{fallbackDelivery.pickup.contact}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Drop
                  </p>
                  <p className="text-sm font-medium">{fallbackDelivery.delivery.address}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{fallbackDelivery.delivery.contact}</p>
                </div>
              </div>

              <div className="border rounded-lg p-3 mb-4">
                <p className="text-[11px] text-muted-foreground mb-2">Items ({items.length})</p>
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 8).map((item, idx) => (
                    <span key={idx} className="text-[11px] bg-muted px-2.5 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Wait timer (visible if arrived) */}
              {arrivedAt && (
                <div className="mb-4">
                  <WaitTimerCard
                    graceRemaining={graceRemaining}
                    waitElapsed={waitElapsed}
                    penalty={accruedPenalty}
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>ETA: {eta} min</span>
                </div>
                <div className="flex gap-2">
                  {!arrivedAt && (
                    <Button size="sm" variant="outline" onClick={handleArrive}>
                      <MapPin className="h-3.5 w-3.5 mr-1" /> Arrived
                    </Button>
                  )}
                  <Button size="sm" onClick={arrivedAt ? handleConfirm : () => setDriveMode(true)}>
                    {arrivedAt ? "Confirm Delivery" : "Start Drive Mode"}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3 space-y-1.5">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3 text-primary" />
                  Transaction stored in shared ledger · Performance updates network data
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Earnings calculated from distance + route efficiency — paid fully to you
                </p>
              </div>
            </div>

            {showEarnings && (
              <EarningsPopover
                onClose={() => setShowEarnings(false)}
                distanceKm={distanceKm}
                baseFare={baseFare}
                perKmRate={perKmRate}
                penalty={accruedPenalty}
                total={totalEarnings + accruedPenalty}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ============ Sub-components ============ */

// Real map shared with the customer side. `large` switches into navigation mode
// (zoomed-in, follows the driver, thicker route lines).
function DeliveryMap({ progress, large }: { progress: number; large?: boolean }) {
  // Demo coords near MG Road, Bangalore. When the driver app is wired to a
  // live order this should pull seller.{lat,lng} and order.customer_{lat,lng}.
  const seller = { lat: 12.9756, lng: 77.605, label: "Pickup" };
  const customer = { lat: 12.9688, lng: 77.6042, label: "Drop" };
  return (
    <LiveMap
      seller={seller}
      customer={customer}
      routeProgress={progress}
      mode={large ? "driver" : "preview"}
      interactive={!large}
      className={large ? "h-full w-full" : "aspect-[16/9] w-full"}
    />
  );
}

function WaitTimerCard({
  graceRemaining,
  waitElapsed,
  penalty,
  compact,
}: {
  graceRemaining: number;
  waitElapsed: number;
  penalty: number;
  compact?: boolean;
}) {
  const inGrace = graceRemaining > 0;
  return (
    <div
      className={`rounded-2xl border-2 px-3 py-2.5 shadow-md ${
        inGrace
          ? "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900"
          : "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
            inGrace ? "bg-amber-100 dark:bg-amber-900/50" : "bg-emerald-100 dark:bg-emerald-900/50"
          }`}
        >
          <Hourglass className={`h-4 w-4 ${inGrace ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${inGrace ? "text-amber-800 dark:text-amber-200" : "text-emerald-800 dark:text-emerald-200"}`}>
            {inGrace ? "Waiting for customer" : "Customer late · earning compensation"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {inGrace
              ? `Free wait time: ${fmtMMSS(graceRemaining)} left · then ₹${PENALTY_PER_MIN}/min`
              : `Total wait ${fmtMMSS(waitElapsed)} · ${compact ? "" : "fully paid to you"}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-base font-extrabold tabular-nums ${inGrace ? "text-amber-900 dark:text-amber-100" : "text-emerald-700 dark:text-emerald-300"}`}>
            {inGrace ? fmtMMSS(graceRemaining) : `+₹${penalty}`}
          </p>
        </div>
      </div>
    </div>
  );
}

function EarningsPopover({
  onClose,
  distanceKm,
  baseFare,
  perKmRate,
  penalty,
  total,
}: {
  onClose: () => void;
  distanceKm: number;
  baseFare: number;
  perKmRate: number;
  penalty: number;
  total: number;
}) {
  const distancePay = Math.round(distanceKm * perKmRate);
  return (
    <div
      className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-3xl shadow-2xl w-full max-w-md p-5 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">How your earnings work</h3>
              <p className="text-[11px] text-muted-foreground">
                Calculated by total distance and route efficiency
              </p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 rounded-2xl bg-muted/40 border p-3 mb-3">
          <Row label="Trip distance" value={`${distanceKm.toFixed(1)} km`} />
          <Row label="Base fare" value={`₹${baseFare}`} />
          <Row label={`Distance pay · ₹${perKmRate}/km`} value={`₹${distancePay}`} />
          {penalty > 0 && (
            <Row label="Customer wait compensation" value={`+₹${penalty}`} accent />
          )}
          <div className="border-t mt-2 pt-2 flex justify-between text-sm font-extrabold">
            <span>You earn</span>
            <span className="text-success">₹{total}</span>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground bg-primary/5 border border-primary/15 rounded-xl px-3 py-2 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
          <span>
            Co-op rule: <strong>100% of trip pay goes to you</strong>. No platform commission.
            Floor is ₹25/trip even on short routes.
          </span>
        </p>

        <Button className="w-full h-11 mt-4" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold tabular-nums ${accent ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}
