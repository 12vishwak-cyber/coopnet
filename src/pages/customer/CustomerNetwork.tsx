import { useState } from "react";
import { Heart, Activity, Sparkles, Users, PiggyBank, Leaf } from "lucide-react";
import VotingPanel from "@/components/VotingPanel";

const impactStats = [
  { label: "Local sellers supported", value: "4", icon: Users, color: "text-rose-500", bg: "bg-rose-500/15" },
  { label: "Earned by workers", value: "₹84", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/15" },
  { label: "Added to community fund", value: "₹42", icon: PiggyBank, color: "text-emerald-500", bg: "bg-emerald-500/15" },
];

const rules = [
  { name: "Contribution Rate", value: "6% of order value" },
  { name: "Routing Logic", value: "Proximity + load balance" },
  { name: "Distribution", value: "78% seller · 12% worker · 6% fund" },
  { name: "Voting Rule", value: "60% majority required" },
];

const events = [
  { text: "Your order ORD-1847 delivered", time: "2m ago", emoji: "📦" },
  { text: "₹34 from your order added to the community fund", time: "2m ago", emoji: "💚" },
  { text: "Priya Fresh Mart thanked you for shopping local", time: "1h ago", emoji: "🌟" },
  { text: "Your 12 orders supported 4 local sellers this month", time: "5h ago", emoji: "❤️" },
];

export default function CustomerNetwork() {
  const [tab, setTab] = useState<"impact" | "activity" | "coop">("impact");

  return (
    <div className="p-4 space-y-4 bg-surface min-h-screen text-foreground">
      {/* Hero — emotional */}
      <div className="bg-gradient-to-br from-rose-400 via-pink-500 to-rose-500 rounded-3xl p-5 text-white shadow-xl shadow-rose-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-4 w-4 fill-white" />
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-90">Your impact this month</p>
        </div>
        <p className="text-2xl font-extrabold leading-tight">You supported 4 local sellers ❤️</p>
        <p className="text-xs font-medium opacity-90 mt-1">
          Every order you place keeps your neighborhood thriving.
        </p>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-3 gap-3">
        {impactStats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-3 text-center shadow-sm border border-border">
            <div className={`h-9 w-9 rounded-2xl ${s.bg} flex items-center justify-center mx-auto mb-1.5`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-base font-extrabold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-2xl p-1">
        {([
          { key: "impact", label: "Impact" },
          { key: "activity", label: "Activity" },
          { key: "coop", label: "Co-op" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-sm py-2.5 rounded-xl transition-all font-semibold ${
              tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "impact" && (
        <div className="space-y-3">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-extrabold text-foreground">Your contribution story</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "🛍️ Spent on local sellers", value: "₹4,820" },
                { label: "🚴 Helped riders earn", value: "₹84" },
                { label: "🌱 Built community fund", value: "₹42" },
                { label: "🏪 Sellers you've helped", value: "4 stores" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">{row.label}</span>
                  <span className="text-sm font-extrabold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/30 flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-emerald-700 dark:text-emerald-300">
                Powered by your neighborhood
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                CoopNet is owned by the people who use it. No middlemen. No platform markup. Just your local economy,
                working together.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-extrabold text-foreground">Recent activity</span>
          </div>
          {events.map((e, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <span className="text-lg shrink-0">{e.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground leading-snug">{e.text}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "coop" && (
        <div className="space-y-3">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              How CoopNet works
            </p>
            {rules.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-xs font-medium text-muted-foreground">{r.name}</span>
                <span className="text-[11px] text-foreground font-semibold text-right max-w-[55%]">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/10 rounded-2xl p-3 border border-emerald-500/30">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">✅ You're eligible to vote</p>
            <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80">
              12 orders completed · Governance rights active
            </p>
          </div>

          <VotingPanel role="customer" variant="compact" flat />
        </div>
      )}
    </div>
  );
}
