import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SupportRole = "seller" | "worker";
export type Priority = "low" | "normal" | "high" | "urgent";

export type SupportTicket = {
  id: string;
  role_context: SupportRole;
  actor_label: string;
  category: string;
  subject: string;
  message: string;
  priority: Priority;
  status: "open" | "in_progress" | "resolved";
  order_ref: string | null;
  response: string | null;
  created_at: string;
  updated_at: string;
};

export const SUPPORT_CATEGORIES: Record<SupportRole, string[]> = {
  seller: ["Order issue", "Payment", "Inventory", "Customer dispute", "Account", "Other"],
  worker: ["Route problem", "Payment", "App bug", "Customer issue", "Account", "Other"],
};

export function useSupportTickets(role: SupportRole, actorLabel: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("role_context", role)
      .eq("actor_label", actorLabel)
      .order("created_at", { ascending: false });
    setTickets((data as SupportTicket[] | null) ?? []);
    setLoading(false);
  }, [role, actorLabel]);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel(`support:${role}:${actorLabel}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refresh, role, actorLabel]);

  const submit = useCallback(
    async (input: { category: string; subject: string; message: string; priority: Priority; orderRef?: string }) => {
      if (input.subject.trim().length < 5) {
        toast.error("Subject must be at least 5 characters");
        return false;
      }
      if (input.message.trim().length < 10) {
        toast.error("Message must be at least 10 characters");
        return false;
      }
      const { error } = await supabase.from("support_tickets").insert({
        role_context: role,
        actor_label: actorLabel,
        category: input.category,
        subject: input.subject.trim(),
        message: input.message.trim(),
        priority: input.priority,
        status: "open",
        order_ref: input.orderRef?.trim() || null,
      });
      if (error) {
        toast.error("Couldn't submit ticket");
        console.warn(error);
        return false;
      }
      toast.success("Ticket submitted — we'll respond shortly");
      refresh();
      return true;
    },
    [role, actorLabel, refresh]
  );

  return { tickets, loading, submit };
}
