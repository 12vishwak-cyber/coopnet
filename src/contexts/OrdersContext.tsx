import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from "react";
import type { CartItem } from "./CartContext";

export type OrderStatus = "Placed" | "Packed" | "Assigned" | "Out for Delivery" | "Delivered";

export const ORDER_STAGES: OrderStatus[] = [
  "Placed",
  "Packed",
  "Assigned",
  "Out for Delivery",
  "Delivered",
];

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  seller: string;
  image: string;
  qty: number;
};

export type OrderEvent = {
  status: OrderStatus;
  at: string; // ISO
  message: string;
};

export type Worker = {
  name: string;
  rating: number;
  earnings: number;
  vehicle: string;
  baseFare?: number;
  perKmRate?: number;
};

export type Order = {
  id: string;
  seller: string;
  total: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  status: OrderStatus;
  date: string;
  dateLabel: string;
  items: OrderItem[];
  etaMin: number;
  worker: Worker;
  events: OrderEvent[];
  workerProgress: number; // 0..1 along route, only meaningful while Out for Delivery
  stopsAhead: number; // visible during Out for Delivery
  distanceKm: number;
  arrivedAt?: string; // ISO when driver arrived at doorstep — starts wait clock
  waitPenalty?: number; // INR accrued, paid to driver
};

const STORAGE_KEY = "coopnet:orders:v2";

// Demo timing — short enough to feel live, long enough to read updates.
const STAGE_DELAYS_MS: Record<OrderStatus, number> = {
  Placed: 0,
  Packed: 8_000,            // 8s after Placed
  Assigned: 14_000,         // 6s after Packed
  "Out for Delivery": 22_000, // 8s after Assigned
  Delivered: 70_000,        // ~48s of in-transit animation
};

const WORKERS: Worker[] = [
  { name: "Arun K.", rating: 4.8, earnings: 0, vehicle: "Cycle" },
  { name: "Priya S.", rating: 4.9, earnings: 0, vehicle: "Scooter" },
  { name: "Ravi M.", rating: 4.7, earnings: 0, vehicle: "Cycle" },
  { name: "Neha T.", rating: 4.9, earnings: 0, vehicle: "Scooter" },
];

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

function timeLabel(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function messageFor(status: OrderStatus, order: Pick<Order, "seller" | "worker">): string {
  switch (status) {
    case "Placed":
      return `Order confirmed and sent to ${order.seller}`;
    case "Packed":
      return `Packed by ${order.seller}`;
    case "Assigned":
      return `${order.worker.name} assigned (${order.worker.vehicle})`;
    case "Out for Delivery":
      return `Picked up from ${order.seller}`;
    case "Delivered":
      return `Delivered by ${order.worker.name}`;
  }
}

type OrdersContextValue = {
  orders: Order[];
  activeOrder: Order | null;
  pastOrders: Order[];
  getOrder: (id: string) => Order | undefined;
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
  const timersRef = useRef<Record<string, number[]>>({});
  const animRef = useRef<Record<string, number>>({});

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  const advanceTo = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (ORDER_STAGES.indexOf(status) <= ORDER_STAGES.indexOf(o.status)) return o;
        const now = new Date();
        const events: OrderEvent[] = [
          ...o.events,
          { status, at: now.toISOString(), message: messageFor(status, o) },
        ];
        let etaMin = o.etaMin;
        if (status === "Out for Delivery") etaMin = Math.max(4, Math.round(o.etaMin * 0.6));
        if (status === "Delivered") etaMin = 0;
        return { ...o, status, events, etaMin };
      }),
    );
  }, []);

  const scheduleLifecycle = useCallback(
    (order: Order) => {
      const stages: OrderStatus[] = ["Packed", "Assigned", "Out for Delivery", "Delivered"];
      const timers = stages.map((s) =>
        window.setTimeout(() => advanceTo(order.id, s), STAGE_DELAYS_MS[s]),
      );
      timersRef.current[order.id] = timers;

      // Worker progress animation tied to the Out-for-Delivery window.
      const startProgressAt = STAGE_DELAYS_MS["Out for Delivery"];
      const endProgressAt = STAGE_DELAYS_MS["Delivered"];
      const startTs = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTs;
        if (elapsed < startProgressAt) {
          animRef.current[order.id] = window.setTimeout(tick, 500) as unknown as number;
          return;
        }
        if (elapsed >= endProgressAt) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === order.id ? { ...o, workerProgress: 1, stopsAhead: 0 } : o,
            ),
          );
          return;
        }
        const ratio = (elapsed - startProgressAt) / (endProgressAt - startProgressAt);
        const stops = ratio < 0.4 ? 2 : ratio < 0.75 ? 1 : 0;
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? { ...o, workerProgress: Math.min(1, ratio), stopsAhead: stops }
              : o,
          ),
        );
        animRef.current[order.id] = window.setTimeout(tick, 400) as unknown as number;
      };
      tick();
    },
    [advanceTo],
  );

  // Resume lifecycle for any in-flight orders after refresh.
  useEffect(() => {
    orders.forEach((o) => {
      if (o.status === "Delivered") return;
      if (timersRef.current[o.id]) return;
      const placedAt = new Date(o.events[0]?.at ?? o.date).getTime();
      const elapsed = Date.now() - placedAt;
      const stages: OrderStatus[] = ["Packed", "Assigned", "Out for Delivery", "Delivered"];
      const timers: number[] = [];
      stages.forEach((s) => {
        const remaining = STAGE_DELAYS_MS[s] - elapsed;
        if (remaining <= 0) {
          // Already past; advance immediately if not yet recorded.
          if (ORDER_STAGES.indexOf(s) > ORDER_STAGES.indexOf(o.status)) {
            advanceTo(o.id, s);
          }
        } else {
          timers.push(window.setTimeout(() => advanceTo(o.id, s), remaining));
        }
      });
      timersRef.current[o.id] = timers;

      // Resume animation tick if relevant.
      if (o.status === "Out for Delivery" || elapsed >= STAGE_DELAYS_MS["Out for Delivery"]) {
        const tick = () => {
          const e2 = Date.now() - placedAt;
          if (e2 >= STAGE_DELAYS_MS["Delivered"]) return;
          const ratio =
            (e2 - STAGE_DELAYS_MS["Out for Delivery"]) /
            (STAGE_DELAYS_MS["Delivered"] - STAGE_DELAYS_MS["Out for Delivery"]);
          const stops = ratio < 0.4 ? 2 : ratio < 0.75 ? 1 : 0;
          setOrders((prev) =>
            prev.map((p) =>
              p.id === o.id
                ? { ...p, workerProgress: Math.max(0, Math.min(1, ratio)), stopsAhead: stops }
                : p,
            ),
          );
          animRef.current[o.id] = window.setTimeout(tick, 500) as unknown as number;
        };
        tick();
      }
    });

    return () => {
      Object.values(timersRef.current).flat().forEach((t) => clearTimeout(t));
      Object.values(animRef.current).forEach((t) => clearTimeout(t));
      timersRef.current = {};
      animRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeOrder: OrdersContextValue["placeOrder"] = useCallback(
    (input) => {
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
      const seller = items[0]?.seller ?? "Local seller";
      const distanceKm = +(0.8 + Math.random() * 2.4).toFixed(1); // 0.8–3.2 km realistic
      const baseFare = 20;
      const perKmRate = 12;
      const tripPay = Math.max(25, Math.round(baseFare + distanceKm * perKmRate));
      const worker = {
        ...WORKERS[Math.floor(Math.random() * WORKERS.length)],
        earnings: tripPay,
        baseFare,
        perKmRate,
      };
      const order: Order = {
        id,
        seller,
        total: input.total,
        subtotal: input.subtotal,
        discount: input.discount,
        deliveryFee: input.deliveryFee,
        status: "Placed",
        date: now.toISOString(),
        dateLabel: prettyDate(now),
        items,
        etaMin: 12 + Math.floor(Math.random() * 4),
        worker,
        events: [
          {
            status: "Placed",
            at: now.toISOString(),
            message: messageFor("Placed", { seller, worker }),
          },
        ],
        workerProgress: 0,
        stopsAhead: 3,
        distanceKm,
      };
      setOrders((prev) => [order, ...prev]);
      scheduleLifecycle(order);
      return order;
    },
    [scheduleLifecycle],
  );

  const clearOrders = useCallback(() => {
    Object.values(timersRef.current).flat().forEach((t) => clearTimeout(t));
    Object.values(animRef.current).forEach((t) => clearTimeout(t));
    timersRef.current = {};
    animRef.current = {};
    setOrders([]);
  }, []);

  const value = useMemo<OrdersContextValue>(() => {
    const activeOrder = orders.find((o) => o.status !== "Delivered") ?? null;
    const pastOrders = orders.filter((o) => o.status === "Delivered");
    const getOrder = (id: string) => orders.find((o) => o.id === id);
    return { orders, activeOrder, pastOrders, getOrder, placeOrder, clearOrders };
  }, [orders, placeOrder, clearOrders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}

export { timeLabel };
