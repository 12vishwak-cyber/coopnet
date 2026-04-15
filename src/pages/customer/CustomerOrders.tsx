import { useNavigate } from "react-router-dom";
import { Package, ChevronRight, Truck } from "lucide-react";

const orders = [
  { id: "ORD-1847", seller: "Kumar Groceries", items: 3, total: "₹572", status: "Delivered", date: "Today, 2:30 PM", image: "🛒" },
  { id: "ORD-1832", seller: "Priya Fresh Mart", items: 2, total: "₹320", status: "In Transit", date: "Today, 1:15 PM", image: "🌿" },
  { id: "ORD-1819", seller: "Ravi General Store", items: 5, total: "₹890", status: "Delivered", date: "Yesterday", image: "🏪" },
  { id: "ORD-1801", seller: "Lakshmi Dairy", items: 1, total: "₹56", status: "Delivered", date: "2 days ago", image: "🥛" },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  "Delivered": { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  "In Transit": { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  "Preparing": { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
};

export default function CustomerOrders() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Your Orders</h1>
        <p className="text-xs text-gray-400 font-medium">Track and manage your purchases</p>
      </div>

      {/* Active order banner */}
      {orders.some(o => o.status === "In Transit") && (
        <button 
          onClick={() => navigate("/customer/order/track")}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-left shadow-lg shadow-emerald-200"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Order on the way!</p>
              <p className="text-[11px] text-white/80">ORD-1832 · Arriving in ~8 mins</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/60" />
          </div>
        </button>
      )}

      <div className="space-y-3">
        {orders.map((o) => {
          const status = statusConfig[o.status] || statusConfig["Preparing"];
          return (
            <button
              key={o.id}
              onClick={() => o.status === "In Transit" ? navigate("/customer/order/track") : navigate("/customer/order/impact")}
              className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
                  {o.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{o.seller}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{o.id} · {o.items} items · {o.total}</p>
                  <p className="text-[11px] text-gray-400">{o.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${status.bg} ${status.text} flex items-center gap-1`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {o.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
