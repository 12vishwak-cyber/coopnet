import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type Item = {
  id: string;
  name: string;
  price: number;
  unit: string;
  seller: string;
  image: string;
};

type Props = {
  item: Item;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Tap-to-expand quantity selector for product cards. Tapping ADD adds the
 * first unit and morphs into a − qty + stepper. Re-collapses to ADD on zero.
 */
export default function QtyButton({ item, size = "md", className = "" }: Props) {
  const { items, addItem, decrementItem } = useCart();
  const inCart = items.find((i) => i.id === item.id);
  const qty = inCart?.quantity ?? 0;
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (qty === 0) return;
    setHot(true);
    const t = setTimeout(() => setHot(false), 220);
    return () => clearTimeout(t);
  }, [qty]);

  const h = size === "sm" ? "h-7" : "h-8";
  const px = size === "sm" ? "px-2.5" : "px-3";
  const text = size === "sm" ? "text-[11px]" : "text-xs";

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  if (qty === 0) {
    return (
      <button
        onClick={(e) => {
          stop(e);
          addItem(item);
        }}
        className={`${h} ${px} ${text} rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-sm flex items-center gap-0.5 active:scale-95 transition-transform ${className}`}
        aria-label={`Add ${item.name} to cart`}
      >
        <Plus className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} /> ADD
      </button>
    );
  }

  return (
    <div
      onClick={stop}
      className={`flex items-center bg-emerald-500 rounded-xl shadow-sm ${h} text-white ${hot ? "animate-scale-in" : ""}`}
    >
      <button
        onClick={() => decrementItem(item.id)}
        className={`${h} w-7 flex items-center justify-center active:scale-90 transition-transform`}
        aria-label="Decrease"
      >
        <Minus className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
      <span className={`${text} font-extrabold w-5 text-center`}>{qty}</span>
      <button
        onClick={() => addItem(item)}
        className={`${h} w-7 flex items-center justify-center active:scale-90 transition-transform`}
        aria-label="Increase"
      >
        <Plus className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </button>
    </div>
  );
}
