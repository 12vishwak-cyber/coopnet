import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, Users, PiggyBank, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerPostOrder() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back
      </button>

      <div className="text-center animate-fade-up py-2">
        <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
          <Heart className="h-6 w-6 text-success" />
        </div>
        <h1 className="text-lg font-semibold">Order Delivered!</h1>
        <p className="text-xs text-muted-foreground">ORD-1847 · Your impact in the network</p>
      </div>

      {/* Impact Cards */}
      <div className="space-y-3 animate-fade-up stagger-1">
        <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">You contributed ₹34 to the cooperative fund</p>
            <p className="text-[11px] text-muted-foreground">Supports routing, intelligence, and shared infrastructure</p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium">You supported a local seller</p>
            <p className="text-[11px] text-muted-foreground">Kumar Groceries received ₹445 directly · No platform commission</p>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <Truck className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm font-medium">You enabled fair worker earnings</p>
            <p className="text-[11px] text-muted-foreground">Worker-07 earned ₹68 · Based on cooperative rules, not surge pricing</p>
          </div>
        </div>
      </div>

      {/* Rate */}
      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-2">
        <h3 className="text-sm font-medium mb-3">Rate Your Experience</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Seller</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => <Star key={n} className={`h-5 w-5 cursor-pointer ${n <= 4 ? "text-warning fill-warning" : "text-muted-foreground"}`} />)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Worker</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => <Star key={n} className={`h-5 w-5 cursor-pointer ${n <= 5 ? "text-warning fill-warning" : "text-muted-foreground"}`} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Membership CTA */}
      <div className="bg-accent/30 border border-primary/10 rounded-xl p-4 animate-fade-up stagger-3">
        <h3 className="text-sm font-semibold mb-1">Become a Cooperative Member</h3>
        <p className="text-xs text-muted-foreground mb-3">
          You've completed 5+ orders. You're eligible to join as a governance member.
          Vote on rules, propose changes, and access system insights.
        </p>
        <Button size="sm" className="h-8 text-xs">
          Apply for Membership <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        Transaction recorded in shared ledger · Value distributed via cooperative rules
      </p>
    </div>
  );
}
