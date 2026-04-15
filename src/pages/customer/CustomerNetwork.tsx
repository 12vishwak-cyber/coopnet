import { useState } from "react";
import { Heart, Scale, Vote, Activity, Check, Clock, TrendingUp, Users, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const impactStats = [
  { label: "Your Contribution", value: "₹420", icon: PiggyBank, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Orders Placed", value: "12", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Sellers Supported", value: "4", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
];

const rules = [
  { name: "Contribution Rate", value: "6% of order value" },
  { name: "Routing Logic", value: "Proximity + load balance" },
  { name: "Distribution", value: "78% seller · 12% worker · 6% fund" },
  { name: "Voting Rule", value: "60% majority required" },
];

const proposals = [
  { title: "Increase contribution to 7%", proposer: "Member-14", votesFor: 28, votesAgainst: 12, total: 48, status: "voting" },
  { title: "Add customer loyalty rewards", proposer: "Seller-23", votesFor: 35, votesAgainst: 5, total: 48, status: "voting" },
  { title: "Reduce system cost allocation", proposer: "Worker-07", votesFor: 40, votesAgainst: 3, total: 48, status: "approved" },
];

const events = [
  { text: "Order ORD-1847 delivered", time: "2m ago" },
  { text: "₹34 added to community fund", time: "2m ago" },
  { text: "New proposal submitted", time: "1h ago" },
  { text: "42 orders processed today", time: "5h ago" },
];

export default function CustomerNetwork() {
  const [tab, setTab] = useState<"impact" | "proposals" | "activity">("impact");

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Heart className="h-5 w-5 text-emerald-500" /> Community & Impact
        </h1>
        <p className="text-xs text-gray-400 font-medium">See your contribution to the network</p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-3 gap-3">
        {impactStats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className={`h-8 w-8 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-1.5`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-[15px] font-bold text-gray-900">{s.value}</p>
            <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
        {(["impact", "proposals", "activity"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-sm py-2.5 rounded-xl transition-all font-semibold capitalize ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === "impact" && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-500" /> Network Rules
            </h3>
            {rules.map(r => (
              <div key={r.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm font-medium text-gray-700">{r.name}</span>
                <span className="text-[11px] text-gray-400 font-medium text-right max-w-[55%]">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="text-[11px] font-bold text-emerald-800">🏛️ Cooperative Governance</p>
            <p className="text-[11px] text-emerald-700 mt-1">
              Rules are decided by members. You have voting rights after 5+ orders.
            </p>
          </div>
        </div>
      )}

      {tab === "proposals" && (
        <div className="space-y-3">
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700">✅ You are eligible to vote</p>
            <p className="text-[10px] text-emerald-600">12 orders completed · Governance rights active</p>
          </div>
          {proposals.map(p => {
            const approval = Math.round((p.votesFor / (p.votesFor + p.votesAgainst)) * 100);
            return (
              <div key={p.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.title}</p>
                    <p className="text-[11px] text-gray-400">by {p.proposer}</p>
                  </div>
                  {p.status === "approved" ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Approved
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Voting
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={approval} className="h-2 flex-1" />
                  <span className="text-[11px] font-bold text-gray-500">{approval}%</span>
                </div>
                {p.status === "voting" && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-9 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600">Vote For</Button>
                    <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl text-xs font-bold border-gray-200">Vote Against</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-bold text-gray-900">Recent Activity</span>
          </div>
          {events.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-700">{e.text}</p>
                <p className="text-[10px] text-gray-400">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
