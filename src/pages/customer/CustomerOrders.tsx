import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Truck, Check, Package, ShoppingBag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABELS, type DbOrder } from "@/lib/coopnet-api";
import { useLanguage } from "@/contexts/LanguageContext";

const ACTIVE = ["placed", "packed", "assigned", "out_for_delivery", "arrived"] as const;

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  return d.toLocaleDateString([], { day: "numeric", month: "short" }) + `, ${time}`;
}

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancelled) return;
      setOrders((data as DbOrder[]) || []);
      setLoading(false);
    };
    load();
    const channel = supabase
      .channel("customer-orders-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        setOrders((prev) => {
          if (payload.eventType === "INSERT") return [payload.new as DbOrder, ...prev];
          if (payload.eventType === "UPDATE")
            return prev.map((o) => (o.id === (payload.new as DbOrder).id ? (payload.new as DbOrder) : o));
          if (payload.eventType === "DELETE")
            return prev.filter((o) => o.id !== (payload.old as DbOrder).id);
          return prev;
        });
      })
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // A customer can only have ONE active order at a time. Treat the most-recent
  // active order as the live one, and ignore any older "stuck active" rows in
  // the shared prototype DB so the list stays realistic.
  const activeOrder = orders.find((o) => (ACTIVE as readonly string[]).includes(o.status));
  const pastOrders = orders.filter((o) => o.status === "delivered");
  const visibleOrders = activeOrder ? [activeOrder, ...pastOrders] : pastOrders;

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-32 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">Your Orders</h1>
          <p className="text-xs text-muted-foreground font-medium">Track and reorder in seconds</p>
        </div>
        <div className="bg-card rounded-3xl p-10 border border-border text-center mt-4">
          <div className="h-16 w-16 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm font-extrabold text-foreground">{t("no_orders")}</p>
          <p className="text-xs text-muted-foreground mt-1">Place your first order to see it here</p>
          <Button
            onClick={() => navigate("/customer")}
            className="mt-5 h-11 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Your Orders</h1>
        <p className="text-xs text-muted-foreground font-medium">Live updates from sellers and drivers</p>
      </div>

      {activeOrder && (
        <button
          onClick={() => navigate(`/customer/order/track/${activeOrder.id}`)}
          className="w-full text-left bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 rounded-3xl p-5 shadow-xl shadow-emerald-500/30 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                {STATUS_LABELS[activeOrder.status]}
              </p>
              <p className="text-2xl font-extrabold text-white leading-none">#{activeOrder.short_code}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70" />
          </div>
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-3">
            <div className="flex -space-x-2">
              {activeOrder.items.slice(0, 3).map((i) => (
                <div key={i.id} className="h-9 w-9 rounded-xl ring-2 ring-emerald-500 overflow-hidden bg-white">
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white truncate">
                {activeOrder.items.length} items · ₹{activeOrder.total}
              </p>
              <p className="text-[10px] text-white/80 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDate(activeOrder.created_at)}
              </p>
            </div>
          </div>
        </button>
      )}

      <div>
        <h2 className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" /> All Orders
        </h2>
        <div className="space-y-3">
          {visibleOrders.map((o) => (
            <button
              key={o.id}
              onClick={() =>
                navigate(
                  o.status === "delivered"
                    ? `/customer/order/impact/${o.id}`
                    : `/customer/order/track/${o.id}`,
                )
              }
              className="w-full text-left bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 shrink-0">
                  {o.items.slice(0, 3).map((i) => (
                    <div key={i.id} className="h-11 w-11 rounded-xl ring-2 ring-card overflow-hidden bg-muted">
                      <img src={i.image} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">#{o.short_code}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {o.items.length} items · ₹{o.total}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    {o.status === "delivered" ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-500" />
                    )}
                    {STATUS_LABELS[o.status]} · {formatDate(o.created_at)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
      {pastOrders.length === 0 && !activeOrder && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          Orders update in real time as sellers and drivers progress.
        </p>
      )}
    </div>
  );
}
