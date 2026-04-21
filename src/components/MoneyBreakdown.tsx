import { useState } from "react";
import { Leaf, ChevronDown, ChevronUp, Truck, Store, Users, Server, Info, TrendingUp, Clock, Coins } from "lucide-react";
import { computePricing, type PricingInput } from "@/lib/pricing";

type Variant = "compact" | "full";

type Props = {
  input: PricingInput;
  variant?: Variant;
  defaultOpen?: boolean;
  /** Show the expandable infographics ("Day in the life of a worker", etc.) */
  showInfographics?: boolean;
};

/**
 * "Where Your Money Goes" — transparent fee + distribution card with
 * optional infographics that explain the co-op economics.
 */
export default function MoneyBreakdown({
  input,
  variant = "compact",
  defaultOpen = false,
  showInfographics = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen || variant === "full");
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const p = computePricing(input);

  const rows = [
    { key: "seller", label: "Seller earnings", amount: p.sellerEarnings, icon: Store, color: "bg-emerald-500", text: "text-emerald-700", soft: "bg-emerald-50" },
    { key: "worker", label: "Delivery driver", amount: p.workerEarnings, icon: Truck, color: "bg-amber-500", text: "text-amber-700", soft: "bg-amber-50" },
    { key: "community", label: "Community fund", amount: p.communityFund, icon: Users, color: "bg-blue-500", text: "text-blue-700", soft: "bg-blue-50" },
    { key: "system", label: "Platform overhead", amount: p.systemCost, icon: Server, color: "bg-gray-400", text: "text-gray-700", soft: "bg-gray-50" },
  ];

  const totalRef = p.sellerEarnings + p.workerEarnings + p.communityFund + p.systemCost || 1;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-extrabold text-gray-900">Where Your ₹{p.total} Goes</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {open && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {/* Stacked share bar */}
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            {rows.map((r) => (
              <div
                key={r.key}
                className={`${r.color} h-full`}
                style={{ width: `${(r.amount / totalRef) * 100}%` }}
                title={`${r.label}: ₹${r.amount}`}
              />
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-2.5">
            {rows.map((r) => {
              const pct = Math.round((r.amount / totalRef) * 100);
              const Icon = r.icon;
              return (
                <div key={r.key} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg ${r.soft} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${r.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-gray-700">{r.label}</span>
                      <span className="font-extrabold text-gray-900">
                        ₹{r.amount} <span className="text-[10px] font-bold text-gray-400">· {pct}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bill detail strip */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-[12px] space-y-1">
            <Row label="Items" value={`₹${p.subtotal}`} />
            {p.discount > 0 && <Row label="Promo discount" value={`−₹${p.discount}`} positive />}
            <Row
              label="Delivery fee"
              value={p.deliveryFee === 0 ? "FREE" : `₹${p.deliveryFee}`}
              positive={p.deliveryFee === 0}
            />
            <Row label="Platform overhead" value={`₹${p.platformFee}`} muted />
            <Row label="Community contribution" value={`₹${p.communityFund} (${Math.round(p.communityPct * 100)}%)`} muted />
            <div className="border-t border-gray-200 mt-1.5 pt-1.5 flex justify-between font-extrabold text-gray-900">
              <span>You pay</span>
              <span>₹{p.total}</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              <strong>No hidden commissions.</strong> Sellers set prices. Delivery drivers get fair per-trip pay.
              The community fund supports shared infrastructure.
            </span>
          </p>

          {showInfographics && (
            <div className="space-y-2 pt-1">
              <Infographic
                id="worker"
                open={openInfo === "worker"}
                onToggle={(id) => setOpenInfo(openInfo === id ? null : id)}
                icon={Truck}
                accent="bg-amber-50 text-amber-700"
                title="Day in the life of a driver"
                subtitle="Why ₹{worker} per trip is fair"
                workerEarnings={p.workerEarnings}
              >
                <Stat label="Trips per day" value="14–18" />
                <Stat label="Avg earning per trip" value="₹35–₹55" />
                <Stat label="Daily take-home" value="₹520–₹780" />
                <Stat label="No surge penalty" value="Guaranteed" />
                <p className="text-[11px] text-gray-600 mt-2">
                  CoopNet floors trip pay at ₹25 and adds ₹12/km. Customer wait charges (after a
                  3-min grace) go 100% to the driver — no deductions.
                </p>
              </Infographic>

              <Infographic
                id="seller"
                open={openInfo === "seller"}
                onToggle={(id) => setOpenInfo(openInfo === id ? null : id)}
                icon={Store}
                accent="bg-emerald-50 text-emerald-700"
                title="Seller monthly P&L"
                subtitle="Why local stores can stay open"
              >
                <Stat label="Avg orders/day" value="42" />
                <Stat label="Gross monthly revenue" value="₹1.8L" />
                <Stat label="Co-op contribution (6%)" value="₹10.8K" />
                <Stat label="Net to seller" value="₹1.69L" highlight />
                <p className="text-[11px] text-gray-600 mt-2">
                  Compare to traditional platforms charging 22–30% commission — sellers keep up to
                  ₹50K/month more on the same volume.
                </p>
              </Infographic>

              <Infographic
                id="break"
                open={openInfo === "break"}
                onToggle={(id) => setOpenInfo(openInfo === id ? null : id)}
                icon={TrendingUp}
                accent="bg-blue-50 text-blue-700"
                title="Break-even economics"
                subtitle="A non-profit model that lasts"
              >
                <Stat label="Platform overhead/order" value="₹4" />
                <Stat label="Servers + ops/order" value="~₹2.4" />
                <Stat label="Surplus → community fund" value="~₹1.6" />
                <p className="text-[11px] text-gray-600 mt-2">
                  CoopNet runs lean: no investor margin to feed. Surplus rolls into the community
                  fund — which members vote to allocate.
                </p>
              </Infographic>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, positive, muted }: { label: string; value: string; positive?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-gray-500" : "text-gray-600"}>{label}</span>
      <span className={`font-semibold ${positive ? "text-emerald-600" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-[12px] py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className={`font-extrabold ${highlight ? "text-emerald-600" : "text-gray-900"}`}>{value}</span>
    </div>
  );
}

function Infographic({
  id,
  open,
  onToggle,
  icon: Icon,
  accent,
  title,
  subtitle,
  workerEarnings,
  children,
}: {
  id: string;
  open: boolean;
  onToggle: (id: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  title: string;
  subtitle: string;
  workerEarnings?: number;
  children: React.ReactNode;
}) {
  const renderedSubtitle = workerEarnings ? subtitle.replace("{worker}", `₹${workerEarnings}`) : subtitle;
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-3 px-3 py-2.5 active:bg-gray-50"
        aria-expanded={open}
      >
        <div className={`h-8 w-8 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[12px] font-extrabold text-gray-900 leading-tight">{title}</p>
          <p className="text-[10px] text-gray-500 truncate">{renderedSubtitle}</p>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="px-3 pb-3 pt-1 animate-fade-in">{children}</div>}
    </div>
  );
}

// Re-exports for convenience.
export { Coins, Clock };
