import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Store, Truck, Users, Check, MapPin, Scale, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Role = "seller" | "worker" | "member" | null;

const roleOptions = [
  { id: "seller" as Role, icon: Store, title: "Join as Seller", desc: "Register your store as a network node", route: "/seller" },
  { id: "worker" as Role, icon: Truck, title: "Join as Worker", desc: "Join the cooperative delivery network", route: "/worker" },
  { id: "member" as Role, icon: Users, title: "Join as Cooperative Member", desc: "Participate in governance and oversight", route: "/network" },
];

function SellerOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
            {s < 5 && <div className={`h-px flex-1 ${step > s ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Store Information</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Your store becomes a network node · Orders routed collectively</p>
          <div className="space-y-3">
            <Input placeholder="Store name" />
            <Input placeholder="Owner name" />
            <Input placeholder="Phone number" />
            <Input placeholder="Category (e.g. Grocery, Electronics)" />
            <Input placeholder="Address" />
          </div>
          <Button className="mt-4 w-full" onClick={() => setStep(2)}>Continue</Button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Location</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Used for routing engine · Used for demand intelligence</p>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-[11px] text-muted-foreground">Map / Address Selector</p>
            </div>
          </div>
          <Input placeholder="Full address" />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Contribution Rules</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Review cooperative contribution and shared fund details</p>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Contribution %</span><span className="text-sm font-medium">6%</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Shared Fund</span><span className="text-sm font-medium">₹84,200</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Routing Cost</span><span className="text-sm font-medium">Covered by fund</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">System Cost</span><span className="text-sm font-medium">Covered by fund</span></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="rules" />
            <label htmlFor="rules" className="text-sm">I accept the cooperative rules</label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-2">Node Created</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Node ID</span><span className="text-sm font-mono font-medium">NODE-IN-MH-049</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Ledger Account</span><span className="text-sm text-success font-medium">Created</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Network</span><span className="text-sm text-success font-medium">Connected</span></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(5)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up text-center">
          <Check className="h-10 w-10 text-success mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">Welcome to CoopNet!</h3>
          <p className="text-sm text-muted-foreground mb-4">Your store is now part of the cooperative network.</p>
          <Button className="w-full" onClick={onComplete}>Go to Seller Dashboard</Button>
        </div>
      )}
    </div>
  );
}

function WorkerOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
            {s < 5 && <div className={`h-px flex-1 ${step > s ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Worker Information</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Join the cooperative delivery network</p>
          <div className="space-y-3">
            <Input placeholder="Full name" />
            <Input placeholder="Phone number" />
            <Input placeholder="Vehicle type (e.g. Bike, Scooter)" />
            <Input placeholder="Preferred area" />
          </div>
          <Button className="mt-4 w-full" onClick={() => setStep(2)}>Continue</Button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Availability</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Set your working preferences</p>
          <div className="space-y-3">
            <Input placeholder="Working hours (e.g. 9 AM - 6 PM)" />
            <Input placeholder="Preferred zone" />
            <Input placeholder="Transport mode" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Cooperative Rules</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Contribution %, assignment rules, performance rules</p>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Contribution %</span><span className="text-sm font-medium">6%</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Assignment</span><span className="text-sm font-medium">Network optimized</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Performance</span><span className="text-sm font-medium">Rating-based priority</span></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="wrules" />
            <label htmlFor="wrules" className="text-sm">I accept the cooperative rules</label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-2">Worker Node Created</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Worker ID</span><span className="text-sm font-mono font-medium">WKR-IN-MH-013</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Routing Network</span><span className="text-sm text-success font-medium">Connected</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Ledger</span><span className="text-sm text-success font-medium">Created</span></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(5)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up text-center">
          <Check className="h-10 w-10 text-success mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">Welcome to CoopNet!</h3>
          <p className="text-sm text-muted-foreground mb-4">You are now connected to the cooperative delivery network.</p>
          <Button className="w-full" onClick={onComplete}>Go to Worker Dashboard</Button>
        </div>
      )}
    </div>
  );
}

function MemberOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
            {s < 5 && <div className={`h-px flex-1 ${step > s ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Member Information</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Join cooperative governance</p>
          <div className="space-y-3">
            <Input placeholder="Full name" />
            <Input placeholder="Role / Expertise" />
            <Input placeholder="Location" />
          </div>
          <Button className="mt-4 w-full" onClick={() => setStep(2)}>Continue</Button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Verification</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Approved by cooperative · Members vote on new governance members</p>
          <div className="border rounded-lg p-4 text-center">
            <Scale className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Verification Pending</p>
            <p className="text-[11px] text-muted-foreground mt-1">Existing members will review your application</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up">
          <h3 className="text-sm font-semibold mb-1">Permissions</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Your governance capabilities</p>
          <div className="space-y-2 mb-4">
            {["View shared ledger", "Vote on rules", "View shared fund", "Approve rule changes"].map((p) => (
              <div key={p} className="flex items-center gap-2 border rounded-lg p-3">
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-sm">{p}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up text-center">
          <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-2">Governance Node Created</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Node ID</span><span className="text-sm font-mono font-medium">GOV-IN-MH-005</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Ledger</span><span className="text-sm text-success font-medium">Connected</span></div>
            <div className="flex justify-between border rounded-lg p-3"><span className="text-sm text-muted-foreground">Rules</span><span className="text-sm text-success font-medium">Connected</span></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(5)}>Continue</Button>
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="bg-card border rounded-lg p-6 animate-fade-up text-center">
          <Check className="h-10 w-10 text-success mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1">Welcome to CoopNet!</h3>
          <p className="text-sm text-muted-foreground mb-4">You now have governance access to the cooperative network.</p>
          <Button className="w-full" onClick={onComplete}>Go to Network Panel</Button>
        </div>
      )}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  if (selectedRole === "seller") return (
    <div className="min-h-screen bg-background p-6">
      <button onClick={() => setSelectedRole(null)} className="text-xs text-muted-foreground hover:text-foreground mb-4 block">← Back to role selection</button>
      <SellerOnboarding onComplete={() => navigate("/seller")} />
    </div>
  );
  if (selectedRole === "worker") return (
    <div className="min-h-screen bg-background p-6">
      <button onClick={() => setSelectedRole(null)} className="text-xs text-muted-foreground hover:text-foreground mb-4 block">← Back to role selection</button>
      <WorkerOnboarding onComplete={() => navigate("/worker")} />
    </div>
  );
  if (selectedRole === "member") return (
    <div className="min-h-screen bg-background p-6">
      <button onClick={() => setSelectedRole(null)} className="text-xs text-muted-foreground hover:text-foreground mb-4 block">← Back to role selection</button>
      <MemberOnboarding onComplete={() => navigate("/network")} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8 animate-fade-up">
          <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-xl font-semibold">Welcome to CoopNet</h1>
          <p className="text-sm text-muted-foreground mt-1">Cooperative Network</p>
          <p className="text-[11px] text-muted-foreground mt-2">All members join as network nodes · No central owner · Rules applied automatically</p>
        </div>

        <div className="space-y-3">
          {roleOptions.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className="w-full bg-card border rounded-lg p-5 flex items-center gap-4 hover:border-primary/50 transition-colors text-left animate-fade-up"
            >
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <r.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          Already a member? <button onClick={() => navigate("/seller")} className="text-primary hover:underline">Go to dashboard</button>
        </p>
      </div>
    </div>
  );
}
