import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { useOrders } from "./OrdersContext";

const STORAGE_KEY = "coopnet:membership:v1";

type MembershipState = {
  joined: boolean;
  joinedAt?: string;
};

type MembershipContextValue = {
  joined: boolean;
  joinedAt?: string;
  ordersCompleted: number;
  ordersRequired: number;
  progressPct: number;
  votingUnlocked: boolean;
  join: () => void;
  reset: () => void;
};

const ORDERS_REQUIRED = 5;

const MembershipContext = createContext<MembershipContextValue | null>(null);

function load(): MembershipState {
  if (typeof window === "undefined") return { joined: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { joined: false };
    return JSON.parse(raw);
  } catch {
    return { joined: false };
  }
}

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { orders } = useOrders();
  const [state, setState] = useState<MembershipState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const join = useCallback(() => {
    setState({ joined: true, joinedAt: new Date().toISOString() });
  }, []);

  const reset = useCallback(() => setState({ joined: false }), []);

  const value = useMemo<MembershipContextValue>(() => {
    const ordersCompleted = orders.length;
    const progressPct = Math.min(100, Math.round((ordersCompleted / ORDERS_REQUIRED) * 100));
    const votingUnlocked = ordersCompleted >= ORDERS_REQUIRED && state.joined;
    return {
      joined: state.joined,
      joinedAt: state.joinedAt,
      ordersCompleted,
      ordersRequired: ORDERS_REQUIRED,
      progressPct,
      votingUnlocked,
      join,
      reset,
    };
  }, [orders.length, state.joined, state.joinedAt, join, reset]);

  return <MembershipContext.Provider value={value}>{children}</MembershipContext.Provider>;
}

export function useMembership() {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used inside MembershipProvider");
  return ctx;
}
