import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function StickyCartBar() {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-40 px-3 pb-2 pointer-events-none">
      <button
        onClick={() => navigate("/customer/cart")}
        className="pointer-events-auto w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl shadow-emerald-500/30 px-4 py-3 flex items-center justify-between active:scale-[0.98] transition-transform animate-in slide-in-from-bottom-2"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-white" />
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-white text-emerald-600 text-[10px] font-extrabold flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[11px] font-medium opacity-90 leading-tight">
              {totalItems} {totalItems === 1 ? "item" : "items"} · Free delivery
            </p>
            <p className="text-sm font-extrabold leading-tight">₹{totalPrice}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-bold">
          View Cart <ChevronRight className="h-4 w-4" />
        </div>
      </button>
    </div>
  );
}
