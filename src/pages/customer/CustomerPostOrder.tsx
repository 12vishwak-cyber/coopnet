import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Star, Users, PiggyBank, Truck, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { useOrders } from "@/contexts/OrdersContext";
import MoneyBreakdown from "@/components/MoneyBreakdown";
import SafeImage from "@/components/SafeImage";
import { toast } from "sonner";

export default function CustomerPostOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = id ? getOrder(id) : undefined;
  const [sellerRating, setSellerRating] = useState(4);
  const [workerRating, setWorkerRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 2400);
    return () => clearTimeout(t);
  }, []);

  const orderId = order?.id ?? "ORD-1847";
  const sellerName = order?.seller ?? "Kumar Groceries";
  const workerName = order?.worker?.name ?? "Arun K.";
  const orderTotal = order?.total ?? 547;
  const orderSubtotal = order?.subtotal ?? 510;
  const orderDiscount = order?.discount ?? 0;
  const community = Math.round((orderSubtotal - orderDiscount) * 0.06);
  const sellerPaid = orderSubtotal - orderDiscount - community;
  const workerPaid = order?.worker?.earnings ?? Math.round(orderTotal * 0.12);

  const items = useMemo(() => order?.items ?? [], [order]);
  const ratedCount = Object.values(itemRatings).filter((v) => v > 0).length;

  const setItemRating = (itemId: string, n: number) =>
    setItemRatings((prev) => ({ ...prev, [itemId]: n }));

  const submitRatings = () => {
    setSubmitted(true);
    toast.success("Thanks for the feedback — it shapes the network.");
  };

  return (
    <div className="min-h-screen bg-surface text-foreground relative overflow-hidden">
      {confetti && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {Array.from({ length: 24 }).map((_, i) => {
            const left = (i * 37) % 100;
            const delay = (i % 6) * 0.08;
            const colors = ["bg-emerald-400", "bg-amber-400", "bg-rose-400", "bg-blue-400", "bg-violet-400"];
            const color = colors[i % colors.length];
            return (
              <span
                key={i}
                className={`absolute top-0 h-2 w-2 ${color} rounded-sm opacity-90 animate-[fall_2.2s_ease-in_forwards]`}
                style={{ left: `${left}%`, animationDelay: `${delay}s` }}
              />
            );
          })}
          <style>{`@keyframes fall { 0%{transform:translateY(-40px) rotate(0);opacity:0} 10%{opacity:1} 100%{transform:translateY(120vh) rotate(540deg);opacity:0} }`}</style>
        </div>
      )}

      <div className="bg-card px-4 py-3 flex items-center gap-3 border-b border-border relative z-10">
        <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-[15px] font-bold text-foreground">Order Complete</span>
      </div>

      <div className="p-4 space-y-3 relative z-10">
        {/* Success */}
        <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
          <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-3 animate-scale-in">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Order Delivered!</h1>
          <p className="text-xs text-muted-foreground mt-1">{orderId} · Here's your impact</p>
        </div>

        {/* Impact Cards */}
        {[
          { icon: PiggyBank, tone: "emerald", title: `₹${community} contributed to community fund`, desc: "Supports routing, infrastructure, and shared intelligence" },
          { icon: Users, tone: "blue", title: "Supported a local seller", desc: `${sellerName} received ₹${sellerPaid} directly — no commission` },
          { icon: Truck, tone: "amber", title: "Fair driver earnings", desc: `${workerName} earned ₹${workerPaid} — based on cooperative rules` },
        ].map(({ icon: Icon, tone, title, desc }) => {
          const toneMap: Record<string, string> = {
            emerald: "bg-emerald-500/15 text-emerald-500",
            blue: "bg-blue-500/15 text-blue-500",
            amber: "bg-amber-500/15 text-amber-500",
          };
          return (
            <div key={title} className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${toneMap[tone]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          );
        })}

        {/* Detailed money breakdown */}
        <MoneyBreakdown
          input={{
            subtotal: orderSubtotal,
            discount: orderDiscount,
            distanceKm: 1.8,
            freeDelivery: order?.deliveryFee === 0,
          }}
          variant="full"
          defaultOpen
          showInfographics
        />

        {/* Ratings */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="text-sm font-bold text-foreground mb-4">Rate Your Experience</h3>
          {[
            { label: `Seller · ${sellerName}`, rating: sellerRating, setRating: setSellerRating },
            { label: `Driver · ${workerName}`, rating: workerRating, setRating: setWorkerRating },
          ].map(({ label, rating, setRating }) => (
            <div key={label} className="flex items-center justify-between mb-3 last:mb-0">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)}>
                    <Star className={`h-6 w-6 transition-colors ${n <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Membership CTA */}
        <button
          onClick={() => navigate("/customer/membership")}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Become a Cooperative Member</p>
              <p className="text-[11px] text-white/80 mt-0.5">Vote on rules & shape the network.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-white/80" />
          </div>
        </button>

        <Button
          className="w-full h-12 rounded-2xl font-bold"
          onClick={() => navigate("/customer")}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
