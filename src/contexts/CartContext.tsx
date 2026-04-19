import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  seller: string;
  image: string;
  quantity: number;
};

export type Promo = {
  code: string;
  label: string;
  type: "percent" | "freeDelivery" | "flat";
  value: number; // percent (0-100), flat amount in INR, ignored for freeDelivery
  minOrder?: number;
};

export const PROMO_CODES: Promo[] = [
  { code: "WELCOME10", label: "10% off your order", type: "percent", value: 10 },
  { code: "FREEDEL", label: "Free delivery", type: "freeDelivery", value: 0 },
  { code: "SAVE50", label: "₹50 off above ₹300", type: "flat", value: 50, minOrder: 300 },
];

const DEFAULT_DELIVERY = 25;

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalPrice: number; // final after promo + delivery
  deliveryFee: number;
  discount: number;
  appliedPromo: Promo | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  addItems: (items: Omit<CartItem, "quantity">[]) => void;
  removeItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "coopnet:cart:v1";
const PROMO_KEY = "coopnet:promo:v1";

function loadItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadPromo(): Promo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROMO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.code ? parsed : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadItems);
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(loadPromo);

  // Persist cart
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  // Persist promo
  useEffect(() => {
    try {
      if (appliedPromo) window.localStorage.setItem(PROMO_KEY, JSON.stringify(appliedPromo));
      else window.localStorage.removeItem(PROMO_KEY);
    } catch {
      /* ignore */
    }
  }, [appliedPromo]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added 🛒`, { duration: 1500 });
  }, []);

  const addItems = useCallback((newItems: Omit<CartItem, "quantity">[]) => {
    if (!newItems.length) return;
    setItems((prev) => {
      const map = new Map(prev.map((i) => [i.id, { ...i }]));
      for (const it of newItems) {
        const existing = map.get(it.id);
        if (existing) existing.quantity += 1;
        else map.set(it.id, { ...it, quantity: 1 });
      }
      return Array.from(map.values());
    });
    toast.success(`${newItems.length} item${newItems.length > 1 ? "s" : ""} added to cart 🛒`, { duration: 1800 });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const decrementItem = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
  }, []);

  const applyPromo = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      const promo = PROMO_CODES.find((p) => p.code === normalized);
      if (!promo) {
        toast.error("Invalid code. Try WELCOME10 or FREEDEL");
        return false;
      }
      const sub = items.reduce((s, i) => s + i.quantity * i.price, 0);
      if (promo.minOrder && sub < promo.minOrder) {
        toast.error(`Add ₹${promo.minOrder - sub} more to use ${promo.code}`);
        return false;
      }
      setAppliedPromo(promo);
      toast.success(`${promo.code} applied · ${promo.label} 🎉`);
      return true;
    },
    [items]
  );

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    toast.message("Promo removed");
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);

    let deliveryFee = subtotal > 0 ? DEFAULT_DELIVERY : 0;
    let discount = 0;

    if (appliedPromo && subtotal > 0) {
      // Re-validate min order in case items changed after applying
      if (appliedPromo.minOrder && subtotal < appliedPromo.minOrder) {
        // skip applying but keep code stored; user will see warning UI
      } else {
        if (appliedPromo.type === "percent") {
          discount = Math.round((subtotal * appliedPromo.value) / 100);
        } else if (appliedPromo.type === "flat") {
          discount = Math.min(appliedPromo.value, subtotal);
        } else if (appliedPromo.type === "freeDelivery") {
          deliveryFee = 0;
        }
      }
    }

    const totalPrice = Math.max(0, subtotal - discount + deliveryFee);

    return {
      items,
      totalItems,
      subtotal,
      totalPrice,
      deliveryFee,
      discount,
      appliedPromo,
      applyPromo,
      removePromo,
      addItem,
      addItems,
      removeItem,
      decrementItem,
      clearCart,
    };
  }, [items, appliedPromo, addItem, addItems, removeItem, decrementItem, clearCart, applyPromo, removePromo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
