import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Package, PiggyBank, LogOut, ArrowLeftRight, AlertCircle, Bell, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const complaintTypes = ["Order issue", "Seller issue", "Worker issue", "System issue", "Payment issue"];

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "complaints" | "settings">("profile");
  const [showForm, setShowForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("coopnet-auth");
    localStorage.removeItem("coopnet-role");
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="text-xs text-muted-foreground">Member of cooperative network</p>
      </div>

      {/* Profile Header */}
      <div className="bg-card border rounded-xl p-5 animate-fade-up stagger-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Customer Node</p>
            <p className="text-[11px] text-muted-foreground font-mono">NODE-CU8X4K</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-lg p-2.5 text-center">
            <Package className="h-3.5 w-3.5 mx-auto text-primary mb-0.5" />
            <p className="text-sm font-semibold">12</p>
            <p className="text-[10px] text-muted-foreground">Orders</p>
          </div>
          <div className="bg-muted rounded-lg p-2.5 text-center">
            <PiggyBank className="h-3.5 w-3.5 mx-auto text-primary mb-0.5" />
            <p className="text-sm font-semibold">₹420</p>
            <p className="text-[10px] text-muted-foreground">Fund Contribution</p>
          </div>
        </div>

        {/* Membership */}
        <div className="mt-4 p-3 bg-accent/30 border border-primary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Membership: Eligible</span>
          </div>
          <p className="text-[10px] text-muted-foreground">12 orders completed · Eligible for governance participation · Can vote on proposals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 animate-fade-up stagger-1">
        {(["profile", "complaints", "settings"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-sm py-2 rounded-md capitalize transition-colors ${tab === t ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
          >{t}</button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-card border rounded-xl p-4 space-y-3 animate-fade-up stagger-2">
          <h3 className="text-sm font-medium">Details</h3>
          {[
            ["Name", "Customer User"],
            ["Phone", "+91 98765 43210"],
            ["Node ID", "NODE-CU8X4K"],
            ["Role", "Customer · Network Participant"],
            ["Member Since", "March 2024"],
            ["Voting Rights", "Active (12 orders)"],
            ["Network Rating", "4.8"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "complaints" && (
        <div className="space-y-3 animate-fade-up stagger-2">
          <div className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-primary" /> Raise Issue
              </h3>
              <button onClick={() => setShowForm(!showForm)} className="text-xs text-primary">
                {showForm ? "Cancel" : "New Complaint"}
              </button>
            </div>

            {showForm && (
              <div className="space-y-3 mb-4 pb-4 border-b">
                <select className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                  <option value="">Select type</option>
                  {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <Input placeholder="Describe the issue..." className="h-10" />
                <Button size="sm" className="h-8 text-xs">Submit Complaint</Button>
                <p className="text-[10px] text-muted-foreground">Complaints reviewed by cooperative committee · No central authority</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="text-xs font-medium">Late delivery — ORD-1801</p>
                  <p className="text-[10px] text-muted-foreground">Submitted 3 days ago</p>
                </div>
                <span className="text-[10px] text-success font-medium">Resolved</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs font-medium">Wrong item — ORD-1790</p>
                  <p className="text-[10px] text-muted-foreground">Submitted 5 days ago</p>
                </div>
                <span className="text-[10px] text-warning font-medium">Under Review</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-3 animate-fade-up stagger-2">
          <div className="bg-card border rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-1.5"><Bell className="h-4 w-4" /> Notifications</h3>
            {[
              { label: "Order updates", default: true },
              { label: "Network alerts", default: false },
              { label: "Governance votes", default: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm">{s.label}</span>
                <Switch defaultChecked={s.default} />
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-1.5"><Eye className="h-4 w-4" /> Data Visibility</h3>
            {[
              { label: "Show contribution in orders", default: true },
              { label: "Display network rank", default: true },
              { label: "Show fund balance", default: false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm">{s.label}</span>
                <Switch defaultChecked={s.default} />
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-1.5"><Settings className="h-4 w-4" /> Account</h3>
            <Button variant="outline" className="w-full justify-start gap-2 h-10 text-sm" onClick={() => navigate("/login")}>
              <ArrowLeftRight className="h-4 w-4" /> Switch Account
            </Button>
            <Button variant="destructive" className="w-full justify-start gap-2 h-10 text-sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout from CoopNet
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">Preferences stored locally · Rules applied by cooperative</p>
        </div>
      )}
    </div>
  );
}
