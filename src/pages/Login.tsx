import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ArrowRight, Store, Truck, ShoppingBag } from "lucide-react";

type Role = "customer" | "seller" | "worker";

const ROLES: { id: Role; label: string; desc: string; icon: typeof Store; route: string }[] = [
  { id: "customer", label: "Customer", desc: "Shop from local sellers near you", icon: ShoppingBag, route: "/customer" },
  { id: "seller", label: "Seller", desc: "Sell through the cooperative network", icon: Store, route: "/seller" },
  { id: "worker", label: "Delivery Driver", desc: "Deliver orders with shared routing", icon: Truck, route: "/worker" },
];

const ONBOARDED_KEY = "coopnet:onboarded:v1";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("customer");

  const handleContinue = () => {
    localStorage.setItem("coopnet-auth", "true");
    localStorage.setItem("coopnet-role", role);

    if (role === "customer") {
      // Customer must always see the onboarding flow first time.
      let onboarded = false;
      try {
        const raw = localStorage.getItem(ONBOARDED_KEY);
        onboarded = raw ? JSON.parse(raw)?.done === true : false;
      } catch {
        onboarded = false;
      }
      navigate(onboarded ? "/customer" : "/customer/welcome");
      return;
    }

    const target = ROLES.find((r) => r.id === role)!.route;
    navigate(target);
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
          <p className="text-sm text-muted-foreground">Cooperative commerce, owned by everyone.</p>
        </div>

        <div className="bg-card border rounded-xl p-6 animate-fade-up stagger-1 space-y-5">
          <div>
            <h2 className="text-base font-semibold mb-1">Sign in to continue</h2>
            <p className="text-xs text-muted-foreground">Choose how you'd like to use CoopNet</p>
          </div>

          <div className="space-y-2.5">
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-colors flex items-center gap-3 ${
                    active ? "border-primary bg-accent" : "border-border hover:bg-muted"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{r.label}</p>
                    <p className="text-[11px] text-muted-foreground">{r.desc}</p>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border-2 shrink-0 ${
                      active ? "border-primary bg-primary" : "border-border"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5 pt-1">
            <Input placeholder="Phone or email" className="h-10" />
            <Input type="password" placeholder="Password" className="h-10" />
          </div>

          <Button className="w-full h-11" onClick={handleContinue}>
            Continue as {ROLES.find((r) => r.id === role)?.label}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>

          <button
            onClick={() => navigate("/onboarding")}
            className="block mx-auto text-xs text-primary hover:underline pt-1"
          >
            New here? Create an account
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4 animate-fade-up stagger-2">
          All members join as network nodes · No central owner · Rules applied automatically
        </p>
      </div>
    </div>
  );
}
