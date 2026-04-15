import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShieldCheck, Heart, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const cartItems = [
  { name: "Rice (5kg)", price: 280, qty: 1, seller: "Kumar Groceries", image: "🍚" },
  { name: "Cooking Oil (1L)", price: 180, qty: 1, seller: "Ravi General Store", image: "🫒" },
  { name: "Milk (1L)", price: 56, qty: 2, seller: "Lakshmi Dairy", image: "🥛" },
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
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-[15px] font-bold text-gray-900">Your Cart</h1>
          <p className="text-[11px] text-gray-400">{cartItems.length} items · Transparent checkout</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Cart Items */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {cartItems.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 ${i < cartItems.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
                {item.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                <p className="text-[11px] text-gray-400">{item.seller}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</span>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-1">
                  <button className="h-6 w-6 flex items-center justify-center text-emerald-600">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold text-emerald-700 w-4 text-center">{item.qty}</span>
                  <button className="h-6 w-6 flex items-center justify-center text-emerald-600">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <button 
            onClick={() => setShowBreakdown(!showBreakdown)} 
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-bold text-gray-900">Where Your Money Goes</span>
            </div>
            {showBreakdown ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          {showBreakdown && (
            <div className="mt-4 space-y-3">
              {[
                { label: "Seller Earnings", amount: sellerEarnings, pct: 78, color: "bg-emerald-500" },
                { label: "Worker Earnings", amount: workerEarnings, pct: 12, color: "bg-amber-500" },
                { label: "Community Fund", amount: cooperativeFund, pct: 6, color: "bg-blue-500" },
                { label: "System Cost", amount: systemCost, pct: 4, color: "bg-gray-300" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-900">₹{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}

              <div className="mt-3 p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-700 space-y-1 border border-emerald-100">
                <p><strong>No hidden fees.</strong> Sellers set their own prices.</p>
                <p><strong>Workers earn fairly</strong> — based on cooperative rules, not surge pricing.</p>
                <p><strong>Community fund</strong> supports local infrastructure & routing.</p>
              </div>
            </div>
          )}
        </div>

        {/* Trust Signals */}
        <div className="flex items-center gap-3 px-1">
          {[
            { icon: ShieldCheck, text: "Transparent pricing" },
            { icon: Heart, text: "Fair distribution" },
            { icon: Leaf, text: "Supports local economy" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1">
              <Icon className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-gray-500">{text}</span>
            </div>
          ))}
        </div>

        {/* Total + CTA */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between mb-4">
            <span className="text-[15px] font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">₹{subtotal}</span>
          </div>
          <Button 
            className="w-full h-14 rounded-2xl text-[15px] font-bold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200" 
            onClick={() => navigate("/customer/order/track")}
          >
            Place Order · ₹{subtotal}
          </Button>
        </div>
      </div>
    </div>
  );
}
