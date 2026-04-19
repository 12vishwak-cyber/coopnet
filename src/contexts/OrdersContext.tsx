import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import type { CartItem } from "./CartContext";

export type OrderStatus = "Preparing" | "In Transit" | "Delivered";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  seller: string;
  image: string;
  qty: number;
};

export type Order = {
  id: string;
  seller: string; // primary seller (first item's seller)
  total: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  status: OrderStatus;
  date: string; // ISO
  dateLabel: string; // pretty label
  items: OrderItem[];
  etaMin?: number;
  step?: 1 | 2 | 3;
};

const STORAGE_KEY = "coopnet:orders:v1";

function loadOrders(): Order[] {
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

function prettyDate(d: Date): string {
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { day: "numeric", month: "short" }) + `, ${time}`;
}

type OrdersContextValue = {
  orders: Order[];
  activeOrder: Order | null;
  pastOrders: Order[];
  placeOrder: (input: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
  }) => Order;
  clearOrders: () => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  const placeOrder: OrdersContextValue["placeOrder"] = useCallback((input) => {
    const now = new Date();
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const items: OrderItem[] = input.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      unit: i.unit,
      seller: i.seller,
      image: i.image,
      qty: i.quantity,
    }));
    const order: Order = {
      id,
      seller: items[0]?.seller ?? "Local seller",
      total: input.total,
      subtotal: input.subtotal,
      discount: input.discount,
      deliveryFee: input.deliveryFee,
      status: "In Transit",
      date: now.toISOString(),
      dateLabel: prettyDate(now),
      items,
      etaMin: 8 + Math.floor(Math.random() * 6),
      step: 2,
    };
    setOrders((prev) => [order, ...prev]);

    // Auto-mark delivered after 60s for a "live" feel (demo only)
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Delivered", step: 3, etaMin: 0 } : o))
      );
    }, 60_000);

    return order;
  }, []);

  const clearOrders = useCallback(() => setOrders([]), []);

  const value = useMemo<OrdersContextValue>(() => {
    const activeOrder = orders.find((o) => o.status !== "Delivered") ?? null;
    const pastOrders = orders.filter((o) => o.status === "Delivered");
    return { orders, activeOrder, pastOrders, placeOrder, clearOrders };
  }, [orders, placeOrder, clearOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}
