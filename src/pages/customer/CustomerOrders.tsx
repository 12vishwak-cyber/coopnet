import { useNavigate } from "react-router-dom";
import { ChevronRight, Truck, RotateCcw, Check, Package } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart, CartItem } from "@/contexts/CartContext";

type OrderItem = Omit<CartItem, "quantity"> & { qty: number };
type Order = {
  id: string;
  seller: string;
  total: string;
  status: "Delivered" | "In Transit" | "Preparing";
  date: string;
  items: OrderItem[];
  etaMin?: number;
  step?: 1 | 2 | 3; // 1 packed, 2 out, 3 delivered
};

const pickProduct = (id: string) => PRODUCTS.find((p) => p.id === id)!;

const orders: Order[] = [
  {
    id: "ORD-1832",
    seller: "Priya Fresh Mart",
    total: "₹320",
    status: "In Transit",
    date: "Today, 1:15 PM",
    etaMin: 8,
    step: 2,
    items: [
      { ...pickProduct("p1"), qty: 2 },
      { ...pickProduct("p7"), qty: 1 },
    ].map((i) => ({ id: i.id, name: i.name, price: i.price, unit: i.unit, seller: i.seller, image: i.image, qty: i.qty })),
  },
  {
    id: "ORD-1847",
    seller: "Kumar Groceries",
    total: "₹572",
    status: "Delivered",
    date: "Today, 2:30 PM",
    items: [
      { ...pickProduct("p4"), qty: 1 },
      { ...pickProduct("p10"), qty: 1 },
      { ...pickProduct("p13"), qty: 1 },
    ].map((i) => ({ id: i.id, name: i.name, price: i.price, unit: i.unit, seller: i.seller, image: i.image, qty: i.qty })),
  },
  {
    id: "ORD-1819",
    seller: "Ravi General Store",
    total: "₹890",
    status: "Delivered",
    date: "Yesterday",
    items: [
      { ...pickProduct("p3"), qty: 2 },
      { ...pickProduct("p6"), qty: 1 },
    ].map((i) => ({ id: i.id, name: i.name, price: i.price, unit: i.unit, seller: i.seller, image: i.image, qty: i.qty })),
  },
  {
    id: "ORD-1801",
    seller: "Lakshmi Dairy",
    total: "₹56",
    status: "Delivered",
    date: "2 days ago",
    items: [{ ...pickProduct("p2"), qty: 1 }, { ...pickProduct("p8"), qty: 1 }].map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      unit: i.unit,
      seller: i.seller,
      image: i.image,
      qty: i.qty,
    })),
  },
];

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { addItems } = useCart();

  const active = orders.find((o) => o.status === "In Transit");
  const past = orders.filter((o) => o.status !== "In Transit");

  const handleReorder = (order: Order) => {
    const flat: Omit<CartItem, "quantity">[] = [];
    order.items.forEach((it) => {
      for (let i = 0; i < it.qty; i++) {
        flat.push({ id: it.id, name: it.name, price: it.price, unit: it.unit, seller: it.seller, image: it.image });
      }
    });
    addItems(flat);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Your Orders</h1>
        <p className="text-xs text-gray-400 font-medium">Track and reorder in seconds</p>
      </div>

      {/* Active order — hero card */}
      {active && (
        <button
          onClick={() => navigate("/customer/order/track")}
          className="w-full text-left bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 rounded-3xl p-5 shadow-xl shadow-emerald-200 active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">Arriving in</p>
              <p className="text-2xl font-extrabold text-white leading-none">{active.etaMin} mins</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70" />
          </div>

          {/* Steps */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  (active.step ?? 1) >= s ? "bg-white" : "bg-white/25"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-white/90">
            <span className={(active.step ?? 1) >= 1 ? "" : "opacity-50"}>✓ Packed</span>
            <span className={(active.step ?? 1) >= 2 ? "" : "opacity-50"}>● Out for delivery</span>
            <span className={(active.step ?? 1) >= 3 ? "" : "opacity-50"}>○ Delivered</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-3">
            <div className="flex -space-x-2">
              {active.items.slice(0, 3).map((i) => (
                <div key={i.id} className="h-9 w-9 rounded-xl ring-2 ring-emerald-500 overflow-hidden bg-white">
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-white truncate">{active.seller}</p>
              <p className="text-[10px] text-white/80">{active.id} · {active.items.length} items · {active.total}</p>
            </div>
          </div>
        </button>
      )}

      {/* Past orders */}
      <div>
        <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" /> Past Orders
        </h2>
        <div className="space-y-3">
          {past.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 shrink-0">
                  {o.items.slice(0, 3).map((i) => (
                    <div key={i.id} className="h-11 w-11 rounded-xl ring-2 ring-white overflow-hidden bg-gray-50">
                      <img src={i.image} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/customer/order/impact")}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm font-bold text-gray-900 truncate">{o.seller}</p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {o.items.length} items · {o.total}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    {o.status} · {o.date}
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
    </div>
  );
}
