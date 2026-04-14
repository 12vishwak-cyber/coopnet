import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const cartItems = [
  { name: "Rice (5kg)", price: 280, qty: 1, seller: "Kumar Groceries" },
  { name: "Cooking Oil (1L)", price: 180, qty: 1, seller: "Ravi General Store" },
  { name: "Milk (1L)", price: 56, qty: 2, seller: "Lakshmi Dairy" },
];

export default function CustomerCart() {
  const navigate = useNavigate();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const sellerEarnings = Math.round(subtotal * 0.78);
  const workerEarnings = Math.round(subtotal * 0.12);
  const cooperativeFund = Math.round(subtotal * 0.06);
  const systemCost = subtotal - sellerEarnings - workerEarnings - cooperativeFund;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back
      </button>

      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" /> Your Cart
        </h1>
        <p className="text-xs text-muted-foreground">Transparent cooperative checkout</p>
      </div>

      <div className="bg-card border rounded-xl p-4 space-y-3 animate-fade-up stagger-1">
        {cartItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">{item.seller} · Qty: {item.qty}</p>
            </div>
            <span className="text-sm font-semibold">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Transparent Breakdown */}
      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Where Your Money Goes</h3>
          <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-[10px] text-primary flex items-center gap-1">
            <Info className="h-3 w-3" /> {showBreakdown ? "Hide" : "How does this work?"}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Seller Earnings</span>
            <span className="font-medium text-primary">₹{sellerEarnings}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "78%" }} />
          </div>

          <div className="flex justify-between text-sm">
            <span>Worker Earnings</span>
            <span className="font-medium text-warning">₹{workerEarnings}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-warning h-1.5 rounded-full" style={{ width: "12%" }} />
          </div>

          <div className="flex justify-between text-sm">
            <span>Cooperative Fund</span>
            <span className="font-medium text-accent-foreground">₹{cooperativeFund}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-accent-foreground h-1.5 rounded-full" style={{ width: "6%" }} />
          </div>

          <div className="flex justify-between text-sm">
            <span>System Cost</span>
            <span className="font-medium">₹{systemCost}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-muted-foreground/40 h-1.5 rounded-full" style={{ width: "4%" }} />
          </div>

          <div className="flex justify-between text-sm font-semibold pt-2 border-t">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
        </div>

        {showBreakdown && (
          <div className="mt-3 p-3 bg-muted rounded-lg text-xs text-muted-foreground space-y-1.5">
            <p><strong>Cooperative Model:</strong> Sellers set their own prices. No platform commission.</p>
            <p><strong>Shared Fund:</strong> 6% goes to the cooperative fund for routing, intelligence, and infrastructure.</p>
            <p><strong>Worker Pay:</strong> Workers receive fair earnings based on cooperative rules, not surge pricing.</p>
            <p><strong>Transparency:</strong> Every transaction is recorded in the shared ledger.</p>
          </div>
        )}
      </div>

      <Button className="w-full h-12 text-sm font-medium animate-fade-up stagger-3" onClick={() => navigate("/customer/order/track")}>
        Place Order · ₹{subtotal}
      </Button>

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        Transaction recorded in shared ledger · No central authority
      </p>
    </div>
  );
}
