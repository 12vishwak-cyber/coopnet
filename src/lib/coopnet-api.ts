// Hooks that wrap Lovable Cloud (Supabase) for the marketplace.
// All read paths use realtime subscriptions so customer/seller/driver
// dashboards reflect the same source of truth.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbSeller = {
  id: string;
  name: string;
  description: string | null;
  location_label: string;
  lat: number;
  lng: number;
  rating: number;
  total_orders: number;
  avg_prep_minutes: number;
  contribution_pct: number;
  banner_image: string | null;
  category: string;
};

export type DbProduct = {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  unit: string;
  image: string;
  category: string;
  tag: string | null;
  in_stock: boolean;
};

export type DbDriver = {
  id: string;
  name: string;
  phone: string | null;
  vehicle: string;
  rating: number;
  total_deliveries: number;
  current_lat: number;
  current_lng: number;
  status: string;
  last_assigned_at: string | null;
};

export type AssignmentReason = {
  distance: number;
  rating: number;
  idleHours: number;
  score: number;
  considered: number;
  explanation: string;
};

export type DbOrder = {
  id: string;
  short_code: string;
  customer_name: string;
  customer_lat: number;
  customer_lng: number;
  customer_address: string;
  seller_id: string;
  driver_id: string | null;
  status:
    | "placed"
    | "packed"
    | "assigned"
    | "out_for_delivery"
    | "arrived"
    | "delivered"
    | "cancelled";
  items: { id: string; name: string; qty: number; price: number; image: string; unit?: string }[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  platform_fee: number;
  community_fund: number;
  wait_penalty: number;
  total: number;
  seller_earnings: number;
  driver_earnings: number;
  distance_km: number;
  assignment_reason: AssignmentReason | null;
  arrived_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbOrderEvent = {
  id: string;
  order_id: string;
  status: string;
  message: string;
  actor: string | null;
  created_at: string;
};

export const STATUS_FLOW: DbOrder["status"][] = [
  "placed",
  "packed",
  "assigned",
  "out_for_delivery",
  "arrived",
  "delivered",
];

export const STATUS_LABELS: Record<DbOrder["status"], string> = {
  placed: "Placed",
  packed: "Packed",
  assigned: "Driver assigned",
  out_for_delivery: "Out for delivery",
  arrived: "Driver arrived",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// ----------------------------- SELLERS ------------------------------------

export function useSellers() {
  const [sellers, setSellers] = useState<DbSeller[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("sellers")
      .select("*")
      .order("rating", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setSellers((data as DbSeller[]) || []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { sellers, loading };
}

export function useSeller(sellerId: string | undefined) {
  const [seller, setSeller] = useState<DbSeller | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!sellerId) return;
    let cancelled = false;
    supabase
      .from("sellers")
      .select("*")
      .eq("id", sellerId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setSeller((data as DbSeller) || null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sellerId]);
  return { seller, loading };
}

// ----------------------------- PRODUCTS -----------------------------------

export function useSellerProducts(sellerId: string | undefined) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!sellerId) return;
    let cancelled = false;
    supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at")
      .then(({ data }) => {
        if (cancelled) return;
        setProducts((data as DbProduct[]) || []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sellerId]);
  return { products, loading };
}

// ----------------------------- ORDERS -------------------------------------

/**
 * Subscribe to a single order with live status updates + its event timeline.
 * Returns { order, events } that re-render whenever the DB changes.
 */
export function useLiveOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [events, setEvents] = useState<DbOrderEvent[]>([]);
  const [seller, setSeller] = useState<DbSeller | null>(null);
  const [driver, setDriver] = useState<DbDriver | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchAll = async () => {
      const { data: o } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();
      if (cancelled || !o) return;
      const ord = o as DbOrder;
      setOrder(ord);

      const [{ data: ev }, { data: s }, drvRes] = await Promise.all([
        supabase
          .from("order_events")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: true }),
        supabase.from("sellers").select("*").eq("id", ord.seller_id).maybeSingle(),
        ord.driver_id
          ? supabase.from("drivers").select("*").eq("id", ord.driver_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      if (cancelled) return;
      setEvents((ev as DbOrderEvent[]) || []);
      setSeller((s as DbSeller) || null);
      setDriver((drvRes.data as DbDriver) || null);
    };
    fetchAll();

    const ordChannel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          if (payload.new) {
            const ord = payload.new as DbOrder;
            setOrder(ord);
            // If a driver was just assigned, fetch them.
            if (ord.driver_id) {
              supabase
                .from("drivers")
                .select("*")
                .eq("id", ord.driver_id)
                .maybeSingle()
                .then(({ data }) => setDriver((data as DbDriver) || null));
            }
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_events", filter: `order_id=eq.${orderId}` },
        (payload) => {
          setEvents((prev) => [...prev, payload.new as DbOrderEvent]);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ordChannel);
    };
  }, [orderId]);

  return { order, events, seller, driver };
}

/**
 * Subscribe to all orders for a given seller (seller dashboard view).
 */
export function useSellerOrders(sellerId: string) {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("orders")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setOrders((data as DbOrder[]) || []);
      });
    const channel = supabase
      .channel(`seller-orders-${sellerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `seller_id=eq.${sellerId}` },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as DbOrder, ...prev];
            if (payload.eventType === "UPDATE")
              return prev.map((o) => (o.id === (payload.new as DbOrder).id ? (payload.new as DbOrder) : o));
            if (payload.eventType === "DELETE")
              return prev.filter((o) => o.id !== (payload.old as DbOrder).id);
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [sellerId]);
  return orders;
}

/**
 * Subscribe to all orders for a given driver (driver app view).
 */
export function useDriverOrders(driverId: string) {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("orders")
      .select("*")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setOrders((data as DbOrder[]) || []);
      });
    const channel = supabase
      .channel(`driver-orders-${driverId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `driver_id=eq.${driverId}` },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as DbOrder, ...prev];
            if (payload.eventType === "UPDATE")
              return prev.map((o) => (o.id === (payload.new as DbOrder).id ? (payload.new as DbOrder) : o));
            return prev;
          });
        },
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [driverId]);
  return orders;
}

/**
 * Subscribe to ALL active orders (for driver dispatch board / unassigned queue).
 */
export function useActiveOrders() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("orders")
      .select("*")
      .neq("status", "delivered")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setOrders((data as DbOrder[]) || []);
      });
    const channel = supabase
      .channel("active-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        setOrders((prev) => {
          if (payload.eventType === "INSERT") {
            const o = payload.new as DbOrder;
            if (o.status === "delivered" || o.status === "cancelled") return prev;
            return [o, ...prev];
          }
          if (payload.eventType === "UPDATE") {
            const o = payload.new as DbOrder;
            const without = prev.filter((p) => p.id !== o.id);
            if (o.status === "delivered" || o.status === "cancelled") return without;
            return [o, ...without];
          }
          return prev;
        });
      })
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);
  return orders;
}

// ----------------------------- ORDER ACTIONS ------------------------------

export async function placeOrder(input: {
  sellerId: string;
  items: { id: string; name: string; qty: number; price: number; image: string; unit?: string }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;
  communityFund: number;
  total: number;
  customerLat?: number;
  customerLng?: number;
  customerAddress?: string;
}) {
  const { data, error } = await supabase.functions.invoke("place-order", {
    body: input,
  });
  if (error) throw error;
  return data?.order as DbOrder;
}

export async function assignDriver(orderId: string, sellerLat: number, sellerLng: number) {
  const { data, error } = await supabase.functions.invoke("assign-driver", {
    body: { orderId, sellerLat, sellerLng },
  });
  if (error) throw error;
  return data;
}

export async function advanceOrder(
  orderId: string,
  toStatus: DbOrder["status"],
  message?: string,
  actor?: string,
) {
  const { error } = await supabase.functions.invoke("advance-order", {
    body: { orderId, toStatus, message, actor },
  });
  if (error) throw error;
}

export async function setWaitPenalty(orderId: string, penalty: number) {
  const { error } = await supabase.functions.invoke("set-wait-penalty", {
    body: { orderId, penalty },
  });
  if (error) throw error;
}
