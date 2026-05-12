import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShieldCheck, Heart, Leaf, Trash2, ShoppingBag, Tag, X, Sparkles, Clock, Wallet, Banknote, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useCart, PROMO_CODES } from "@/contexts/CartContext";
import MoneyBreakdown from "@/components/MoneyBreakdown";
import SafeImage from "@/components/SafeImage";
import { freeDeliveryProgress } from "@/lib/pricing";
import { placeOrder as placeOrderCloud, assignDriver, advanceOrder } from "@/lib/coopnet-api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type PayMethod = "upi" | "cod";

export default function CustomerCart() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [placing, setPlacing] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
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
      <div className="min-h-screen bg-surface text-foreground">
        <div className="bg-card px-4 py-3 flex items-center gap-3 border-b border-border">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h1 className="text-[15px] font-bold text-foreground">Your Cart</h1>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="h-20 w-20 rounded-3xl bg-primary/15 flex items-center justify-center mb-4">
            <ShoppingBag className="h-9 w-9 text-primary" />
          </div>
          <p className="text-base font-extrabold text-foreground">Your cart is empty</p>
          <p className="text-[13px] text-muted-foreground mt-1">Add fresh items from local sellers</p>
          <Button
            onClick={() => navigate("/customer")}
            className="mt-6 h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-foreground">
      {/* Header */}
      <div className="bg-card px-4 py-3 flex items-center justify-between gap-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-foreground">Your Cart</h1>
            <p className="text-[11px] text-muted-foreground">{items.length} items · Transparent checkout</p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-[11px] font-bold text-muted-foreground hover:text-rose-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Cart Items */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
          {items.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-3 p-4 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
              <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                <SafeImage src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" width={56} height={56} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.unit} · {item.seller}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[10px] font-semibold text-rose-500 mt-0.5 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-sm font-bold text-foreground">₹{item.price * item.quantity}</span>
                <div className="flex items-center gap-2 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-lg px-1">
                  <button
                    onClick={() => decrementItem(item.id)}
                    className="h-6 w-6 flex items-center justify-center text-emerald-600 dark:text-emerald-400 active:scale-90 transition-transform"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, unit: item.unit, seller: item.seller, image: item.image })}
                    className="h-6 w-6 flex items-center justify-center text-emerald-600 dark:text-emerald-400 active:scale-90 transition-transform"
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
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-bold text-foreground">Apply Promo Code</span>
          </div>

          {appliedPromo ? (
            <div className="flex items-center justify-between gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold text-emerald-700 dark:text-emerald-300 truncate">{appliedPromo.code}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate">{appliedPromo.label}</p>
                </div>
              </div>
              <button
                onClick={removePromo}
                className="h-7 w-7 rounded-full bg-card flex items-center justify-center text-emerald-700 dark:text-emerald-300 active:scale-90 transition-transform"
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
                className="h-11 rounded-xl text-sm font-semibold uppercase tracking-wide placeholder:text-muted-foreground placeholder:normal-case placeholder:tracking-normal placeholder:font-medium"
              />
              <Button
                onClick={handleApply}
                disabled={!promoInput.trim()}
                className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shrink-0"
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
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 active:scale-95 transition-transform"
                >
                  {p.code} · {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Free-delivery progress + urgency countdown */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border space-y-3">
          {!fdp.unlocked ? (
            <>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-bold text-foreground">
                  Add ₹{fdp.remaining} more for <span className="text-emerald-600 dark:text-emerald-400">FREE delivery</span>
                </span>
                <span className="text-[10px] font-extrabold text-muted-foreground">{fdp.pct}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all" style={{ width: `${fdp.pct}%` }} />
              </div>
            </>
          ) : (
            <p className="text-[12px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              🎉 Free delivery unlocked!
            </p>
          )}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              Order in next <span className="font-mono font-extrabold">{fmtCountdown(countdown)}</span> for fastest delivery
            </p>
          </div>
        </div>

        {/* Money breakdown */}
        <MoneyBreakdown
          input={{ subtotal, discount, distanceKm, freeDelivery: appliedPromo?.type === "freeDelivery" }}
          variant="compact"
          defaultOpen={false}
        />

        {(discount > 0 || appliedPromo?.type === "freeDelivery") && (
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 text-center">
            🎉 You saved ₹{discount + (appliedPromo?.type === "freeDelivery" ? 25 : 0)} on this order
          </p>
        )}

        {/* Trust Signals */}
        <div className="flex items-center gap-3 px-1">
          {[
            { icon: ShieldCheck, text: "Transparent pricing" },
            { icon: Heart, text: "Fair distribution" },
            { icon: Leaf, text: "Supports local economy" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1">
              <Icon className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">{t("payment_method")}</span>
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              { id: "upi", label: t("pay_upi"), icon: Wallet, sub: "PhonePe · GPay · Paytm" },
              { id: "cod", label: t("pay_cod"), icon: Banknote, sub: "Pay when delivered" },
            ] as const).map((opt) => {
              const active = payMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPayMethod(opt.id as PayMethod)}
                  className={`text-left rounded-xl p-3 border-2 transition-colors ${
                    active ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <opt.icon className={`h-4 w-4 ${active ? "text-emerald-600" : "text-muted-foreground"}`} />
                    <span className="text-sm font-bold text-foreground">{opt.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{opt.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust banner */}
        <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-extrabold text-emerald-700 dark:text-emerald-300">
              {t("safe_payment")} <span className="text-emerald-600">सुरक्षित</span>
            </p>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
              {t("money_released")}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <Button
            disabled={placing}
            className="w-full h-14 rounded-2xl text-[15px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 disabled:opacity-70"
            onClick={async () => {
              if (placing || items.length === 0) return;
              setPlacing(true);
              try {
                // Resolve seller from the first item — look up its sellerId in DB.
                const firstSellerName = items[0].seller;
                const { data: sellers } = await supabase
                  .from("sellers")
                  .select("id, lat, lng, name")
                  .eq("name", firstSellerName)
                  .limit(1);
                const seller = sellers?.[0];
                if (!seller) {
                  toast.error("Seller not found in network");
                  setPlacing(false);
                  return;
                }
                const order = await placeOrderCloud({
                  sellerId: seller.id,
                  items: items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    qty: i.quantity,
                    price: i.price,
                    image: i.image,
                    unit: i.unit,
                  })),
                  subtotal,
                  discount,
                  deliveryFee,
                  platformFee,
                  communityFund,
                  total: totalPrice,
                });
                clearCart();
                navigate(`/customer/order/track/${order.id}`);
                // Kick off lifecycle in the background.
                setTimeout(async () => {
                  try {
                    await advanceOrder(order.id, "packed", `Packed by ${seller.name}`, "seller");
                    await assignDriver(order.id, seller.lat, seller.lng);
                    setTimeout(() => {
                      advanceOrder(order.id, "out_for_delivery", "Picked up — heading to you", "driver").catch(() => {});
                    }, 12_000);
                  } catch (e) {
                    console.warn("Lifecycle advance failed", e);
                  }
                }, 4_000);
              } catch (e) {
                toast.error("Could not place order");
                console.error(e);
                setPlacing(false);
              }
            }}
          >
            {placing ? "Placing…" : `Place Order · ₹${totalPrice}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
