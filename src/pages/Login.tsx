import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ArrowRight, Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"seller" | "worker" | "member" | null>(null);

  const handleLogin = () => {
    localStorage.setItem("coopnet-auth", "true");
    localStorage.setItem("coopnet-role", "seller");
    navigate("/seller");
  };

  const handleSignupSubmit = () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    localStorage.setItem("coopnet-auth", "true");
    localStorage.setItem("coopnet-role", role || "seller");
    if (role === "member") navigate("/network");
    else if (role === "worker") navigate("/worker");
    else navigate("/seller");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">CoopNet</span>
          </div>
          <p className="text-sm text-muted-foreground">Cooperative Network Platform</p>
        </div>

        <div className="bg-card border rounded-xl p-6 animate-fade-up stagger-1">
          {mode === "login" ? (
            <>
              <h2 className="text-base font-semibold mb-1">Welcome back</h2>
              <p className="text-xs text-muted-foreground mb-5">Login to your cooperative node</p>
              <div className="space-y-3">
                <Input placeholder="Phone or Email" className="h-10" />
                <Input type="password" placeholder="Password or OTP" className="h-10" />
                <Button className="w-full h-10" onClick={handleLogin}>
                  Login <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <button onClick={() => { setMode("signup"); setStep(1); }} className="text-xs text-primary hover:underline">
                  Create account → Join as a new member
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold">Create Account</h2>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Step {step}/4</span>
              </div>

              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground mb-3">Choose your role in the cooperative network</p>
                  {([
                    { id: "seller" as const, label: "Seller", desc: "Sell products through the cooperative network" },
                    { id: "worker" as const, label: "Worker", desc: "Deliver orders using shared routing" },
                    { id: "member" as const, label: "Cooperative Member", desc: "Governance, auditing, or committee role" },
                  ]).map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${role === r.id ? "border-primary bg-accent" : "hover:bg-muted"}`}
                    >
                      <p className="text-sm font-medium">{r.label}</p>
                      <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    {role === "seller" ? "Store details" : role === "worker" ? "Worker details" : "Member details"}
                  </p>
                  {role === "seller" && (
                    <>
                      <Input placeholder="Store Name" className="h-10" />
                      <Input placeholder="Owner Name" className="h-10" />
                      <Input placeholder="Address" className="h-10" />
                      <Input placeholder="GST / ID (optional)" className="h-10" />
                      <Input placeholder="Phone" className="h-10" />
                    </>
                  )}
                  {role === "worker" && (
                    <>
                      <Input placeholder="Full Name" className="h-10" />
                      <Input placeholder="Phone" className="h-10" />
                      <Input placeholder="Vehicle Type" className="h-10" />
                      <Input placeholder="Operating Area" className="h-10" />
                    </>
                  )}
                  {role === "member" && (
                    <>
                      <Input placeholder="Full Name" className="h-10" />
                      <Input placeholder="Phone" className="h-10" />
                      <Input placeholder="Role Type (Member / Auditor / Admin / Committee)" className="h-10" />
                      <Input placeholder="Reason to join" className="h-10" />
                    </>
                  )}
                  <p className="text-[10px] text-muted-foreground">Your profile becomes a network node · Orders routed collectively</p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Review cooperative rules before joining</p>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span>Contribution Rate</span><span className="font-medium">6%</span></div>
                    <div className="flex justify-between text-sm"><span>Shared Fund</span><span className="font-medium">Active</span></div>
                    <div className="flex justify-between text-sm"><span>Routing</span><span className="font-medium">Network Optimized</span></div>
                    <div className="flex justify-between text-sm"><span>Assignment</span><span className="font-medium">Cooperative Logic</span></div>
                  </div>
                  <label className="flex items-start gap-2 text-xs">
                    <input type="checkbox" className="mt-0.5 rounded" defaultChecked />
                    <span>I accept the cooperative rules and agree to contribute to the shared fund</span>
                  </label>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-4 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mx-auto">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Node Created</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {role === "member" ? "Pending approval by cooperative" : "Connected to network"}
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-left space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Node ID</span><span className="font-mono">NODE-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Ledger</span><span>Created</span></div>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Status</span><span className="text-success">{role === "member" ? "Pending" : "Active"}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-5">
                {step > 1 && (
                  <Button variant="outline" className="flex-1 h-10" onClick={() => setStep(step - 1)}>Back</Button>
                )}
                <Button
                  className="flex-1 h-10"
                  disabled={step === 1 && !role}
                  onClick={handleSignupSubmit}
                >
                  {step === 4 ? "Enter Dashboard" : "Continue"} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t text-center">
                <button onClick={() => { setMode("login"); setStep(1); }} className="text-xs text-primary hover:underline">
                  Already a member? Login
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4 animate-fade-up stagger-2">
          All members join as network nodes · No central owner · Rules applied automatically
        </p>
      </div>
    </div>
  );
}
