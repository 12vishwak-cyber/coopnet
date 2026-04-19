import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Package, PiggyBank, LogOut, ArrowLeftRight, AlertCircle, Bell, Settings, Star,
  ChevronDown, ChevronUp, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const complaintTypes = ["Order issue", "Seller issue", "Worker issue", "System issue", "Payment issue"];

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "complaints" | "settings">("profile");
  const [showForm, setShowForm] = useState(false);
  const [showMembership, setShowMembership] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("coopnet-auth");
    localStorage.removeItem("coopnet-role");
    navigate("/login");
  };

  const ordersCompleted = 12;
  const ordersForGovernance = 15;
  const progressPct = Math.round((ordersCompleted / ordersForGovernance) * 100);

  return (
    <div className="p-4 space-y-4">
      {/* Friendly greeting header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-gray-400 font-medium">Hey there 👋</p>
            <p className="text-lg font-extrabold text-gray-900 leading-tight">Customer User</p>
            <p className="text-[10px] text-gray-300 font-mono mt-0.5">NODE-CU8X4K</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Package, label: "Orders", value: "12", color: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: PiggyBank, label: "Saved", value: "₹420", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Star, label: "Rating", value: "4.8", color: "text-amber-500", bg: "bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
              <s.icon className={`h-4 w-4 mx-auto ${s.color} mb-1`} />
              <p className="text-base font-extrabold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
        {(["profile", "complaints", "settings"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-sm py-2.5 rounded-xl font-semibold capitalize transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
            }`}
          >{t === "complaints" ? "Support" : t}</button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900 mb-3">Your details</h3>
            {[
              ["Name", "Customer User"],
              ["Phone", "+91 98765 43210"],
              ["Member since", "March 2024"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{k}</span>
                <span className="text-sm font-semibold text-gray-900">{v}</span>
              </div>
            ))}
          </div>

          {/* Membership — collapsible, de-emphasized */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowMembership((v) => !v)}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-gray-50"
            >
              <div className="h-9 w-9 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Cooperative membership</p>
                <p className="text-[11px] text-gray-400">Earn voting rights as you shop</p>
              </div>
              {showMembership ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {showMembership && (
              <div className="px-4 pb-4 -mt-1 space-y-3">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3.5 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-900">Governance Progress</span>
                    <span className="text-[11px] font-bold text-emerald-600">{ordersCompleted}/{ordersForGovernance}</span>
                  </div>
                  <Progress value={progressPct} className="h-2 mb-1.5" />
                  <p className="text-[10px] text-gray-500">
                    {ordersCompleted >= ordersForGovernance
                      ? "🎉 You've unlocked full governance access!"
                      : `${ordersForGovernance - ordersCompleted} more orders to unlock voting`}
                  </p>
                </div>
                <div className="text-[11px] text-gray-500">
                  Role: <span className="font-semibold text-gray-700">Customer · Member</span> · Voting:{" "}
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "complaints" && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-emerald-500" /> Help & Support
              </h3>
              <button onClick={() => setShowForm(!showForm)} className="text-xs font-bold text-emerald-600">
                {showForm ? "Cancel" : "+ New Issue"}
              </button>
            </div>

            {showForm && (
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <select className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700">
                  <option value="">Select type</option>
                  {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <Input placeholder="Describe the issue..." className="h-11 rounded-xl border-gray-200 bg-gray-50" />
                <Button size="sm" className="h-9 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600">Submit</Button>
                <p className="text-[10px] text-gray-400">Reviewed by cooperative committee</p>
              </div>
            )}

            {[
              { title: "Late delivery — ORD-1801", date: "3 days ago", status: "Resolved", color: "text-emerald-600 bg-emerald-50" },
              { title: "Wrong item — ORD-1790", date: "5 days ago", status: "Under Review", color: "text-amber-600 bg-amber-50" },
            ].map(c => (
              <div key={c.title} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-gray-900">{c.title}</p>
                  <p className="text-[10px] text-gray-400">{c.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.color}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5"><Bell className="h-4 w-4" /> Notifications</h3>
            {[
              { label: "Order updates", default: true },
              { label: "Offers & promos", default: true },
              { label: "Cooperative updates", default: false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">{s.label}</span>
                <Switch defaultChecked={s.default} />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5"><Settings className="h-4 w-4" /> Account</h3>
            <Button variant="outline" className="w-full justify-start gap-2 h-11 rounded-xl text-sm font-medium border-gray-200" onClick={() => navigate("/login")}>
              <ArrowLeftRight className="h-4 w-4" /> Switch Account
            </Button>
            <Button variant="destructive" className="w-full justify-start gap-2 h-11 rounded-xl text-sm font-medium" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
