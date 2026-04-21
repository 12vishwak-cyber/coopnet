import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShieldCheck, Heart, Leaf, Trash2, ShoppingBag, Tag, X, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useCart, PROMO_CODES } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import MoneyBreakdown from "@/components/MoneyBreakdown";
import { freeDeliveryProgress } from "@/lib/pricing";

export default function CustomerCart() {
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const [promoInput, setPromoInput] = useState("");
  const [countdown, setCountdown] = useState(180); // 3-min "fastest delivery" urgency
  const {
    items,
    subtotal,
    discount,
    deliveryFee,
    totalPrice,
    platformFee,
    communityFund,
    distanceKm,
    appliedPromo,
    applyPromo,
    removePromo,
    addItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (items.length === 0) return;
    const t = window.setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [items.length]);

  const fdp = freeDeliveryProgress(subtotal - discount);

  const handleApply = () => {
    if (!promoInput.trim()) return;
    if (applyPromo(promoInput)) setPromoInput("");
  };

  const fmtCountdown = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <h1 className="text-[15px] font-bold text-gray-900">Your Cart</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="h-20 w-20 rounded-3xl bg-emerald-50 flex items-center justify-center mb-4">
            <ShoppingBag className="h-9 w-9 text-emerald-500" />
          </div>
          <p className="text-base font-extrabold text-gray-900">Your cart is empty</p>
          <p className="text-[13px] text-gray-500 mt-1">Add fresh items from local sellers</p>
          <Button
            onClick={() => navigate("/customer")}
            className="mt-6 h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between gap-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-gray-900">Your Cart</h1>
            <p className="text-[11px] text-gray-400">{items.length} items · Transparent checkout</p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-[11px] font-bold text-gray-400 hover:text-rose-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Cart Items */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {items.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-3 p-4 ${i < items.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" width={56} height={56} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{item.unit} · {item.seller}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[10px] font-semibold text-rose-500 mt-0.5 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</span>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-1">
                  <button
                    onClick={() => decrementItem(item.id)}
                    className="h-6 w-6 flex items-center justify-center text-emerald-600 active:scale-90 transition-transform"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold text-emerald-700 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, unit: item.unit, seller: item.seller, image: item.image })}
                    className="h-6 w-6 flex items-center justify-center text-emerald-600 active:scale-90 transition-transform"
                    aria-label="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-bold text-gray-900">Apply Promo Code</span>
          </div>

          {appliedPromo ? (
            <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold text-emerald-700 truncate">{appliedPromo.code}</p>
                  <p className="text-[11px] text-emerald-600 truncate">{appliedPromo.label}</p>
                </div>
              </div>
              <button
                onClick={removePromo}
                className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-emerald-700 active:scale-90 transition-transform"
                aria-label="Remove promo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Enter code"
                className="h-11 rounded-xl text-sm font-semibold uppercase tracking-wide border-gray-200 placeholder:text-gray-400 placeholder:normal-case placeholder:tracking-normal placeholder:font-medium"
              />
              <Button
                onClick={handleApply}
                disabled={!promoInput.trim()}
                className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-sm shrink-0"
              >
                Apply
              </Button>
            </div>
          )}

          {!appliedPromo && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {PROMO_CODES.map((p) => (
                <button
                  key={p.code}
                  onClick={() => applyPromo(p.code)}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 active:scale-95 transition-transform"
                >
                  {p.code} · {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bill summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-600">Item total</span>
            <span className="font-semibold text-gray-900">₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-emerald-600 font-medium">Promo discount</span>
              <span className="font-semibold text-emerald-600">−₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-600">Delivery fee</span>
            <span className="font-semibold text-gray-900">
              {deliveryFee === 0 ? (
                <span className="text-emerald-600">FREE</span>
              ) : (
                `₹${deliveryFee}`
              )}
            </span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="text-sm font-bold text-gray-900">To Pay</span>
            <span className="text-base font-extrabold text-gray-900">₹{totalPrice}</span>
          </div>
          {discount + (subtotal > 0 && deliveryFee === 0 && appliedPromo?.type === "freeDelivery" ? 25 : 0) > 0 && (
            <p className="text-[11px] font-semibold text-emerald-600 text-center pt-1">
              🎉 You saved ₹{discount + (appliedPromo?.type === "freeDelivery" ? 25 : 0)} on this order
            </p>
          )}
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
          <Button
            className="w-full h-14 rounded-2xl text-[15px] font-bold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200"
            onClick={() => {
              const o = placeOrder({ items, subtotal, discount, deliveryFee, total: totalPrice });
              clearCart();
              navigate(`/customer/order/track/${o.id}`);
            }}
          >
            Place Order · ₹{totalPrice}
          </Button>
        </div>
      </div>
    </div>
  );
}
