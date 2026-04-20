import { useNavigate } from "react-router-dom";
import { ChevronRight, Truck, RotateCcw, Check, Package, ShoppingBag } from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useOrders, Order, ORDER_STAGES } from "@/contexts/OrdersContext";
import { Button } from "@/components/ui/button";

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { addItems } = useCart();
  const { activeOrder, pastOrders, orders } = useOrders();

  const handleReorder = (order: Order) => {
    const flat: Omit<CartItem, "quantity">[] = [];
    order.items.forEach((it) => {
      for (let i = 0; i < it.qty; i++) {
        flat.push({ id: it.id, name: it.name, price: it.price, unit: it.unit, seller: it.seller, image: it.image });
      }
    });
    addItems(flat);
    navigate("/customer/cart");
  };

  if (orders.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Your Orders</h1>
          <p className="text-xs text-gray-400 font-medium">Track and reorder in seconds</p>
        </div>
        <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center mt-4">
          <div className="h-16 w-16 rounded-3xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="h-7 w-7 text-emerald-500" />
          </div>
          <p className="text-sm font-extrabold text-gray-900">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">Place your first order to see it here</p>
          <Button
            onClick={() => navigate("/customer")}
            className="mt-5 h-11 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold"
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
        <h1 className="text-lg font-bold text-gray-900">Your Orders</h1>
        <p className="text-xs text-gray-400 font-medium">Track and reorder in seconds</p>
      </div>

      {/* Active order — hero card */}
      {activeOrder && (
        <button
          onClick={() => navigate(`/customer/order/track/${activeOrder.id}`)}
          className="w-full text-left bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 rounded-3xl p-5 shadow-xl shadow-emerald-200 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{activeOrder.status}</p>
              <p className="text-2xl font-extrabold text-white leading-none">
                {activeOrder.etaMin > 0 ? `${activeOrder.etaMin} mins` : "Arrived"}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70" />
          </div>

          {(() => {
            const stepIdx = ORDER_STAGES.indexOf(activeOrder.status); // 0..4
            return (
              <>
                <div className="flex items-center gap-1 mb-3">
                  {[0, 1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full ${stepIdx > s ? "bg-white" : "bg-white/25"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-white/90">
                  <span className={stepIdx >= 1 ? "" : "opacity-50"}>✓ Packed</span>
                  <span className={stepIdx >= 2 ? "" : "opacity-50"}>◉ Assigned</span>
                  <span className={stepIdx >= 3 ? "" : "opacity-50"}>● Out</span>
                  <span className={stepIdx >= 4 ? "" : "opacity-50"}>○ Delivered</span>
                </div>
              </>
            );
          })()}

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-3">
            <div className="flex -space-x-2">
              {activeOrder.items.slice(0, 3).map((i) => (
                <div key={i.id} className="h-9 w-9 rounded-xl ring-2 ring-emerald-500 overflow-hidden bg-white">
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white truncate">{activeOrder.seller}</p>
              <p className="text-[10px] text-white/80">{activeOrder.id} · {activeOrder.items.length} items · ₹{activeOrder.total}</p>
            </div>
          </div>
        </button>
      )}

      {/* Past orders */}
      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" /> Past Orders
          </h2>
          <div className="space-y-3">
            {pastOrders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 shrink-0">
                    {o.items.slice(0, 3).map((i) => (
                      <div key={i.id} className="h-11 w-11 rounded-xl ring-2 ring-white overflow-hidden bg-gray-50">
                        <img src={i.image} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/customer/order/impact/${o.id}`)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-sm font-bold text-gray-900 truncate">{o.seller}</p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {o.items.length} items · ₹{o.total}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-500" />
                      {o.status} · {o.dateLabel}
                    </p>
                  </button>
                  <button
                    onClick={() => handleReorder(o)}
                    className="shrink-0 h-9 px-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-transform border border-emerald-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
