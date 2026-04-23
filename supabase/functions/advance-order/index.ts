// Manually advance an order's lifecycle status, recording an event.
// Called by client roles (seller "Mark packed", driver "Picked up", etc.)
// Body: { orderId, toStatus, message?, actor? }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID = new Set([
  "placed",
  "packed",
  "assigned",
  "out_for_delivery",
  "arrived",
  "delivered",
  "cancelled",
]);

const STATUS_MESSAGES: Record<string, string> = {
  placed: "Order placed",
  packed: "Packed and ready for pickup",
  assigned: "Driver assigned",
  out_for_delivery: "Picked up — out for delivery",
  arrived: "Driver arrived at your doorstep",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { orderId, toStatus, message, actor } = await req.json();
    if (!orderId || !VALID.has(toStatus)) {
      return new Response(JSON.stringify({ error: "Invalid orderId/toStatus" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const updates: Record<string, unknown> = { status: toStatus };
    if (toStatus === "arrived") updates.arrived_at = new Date().toISOString();
    if (toStatus === "delivered") updates.delivered_at = new Date().toISOString();

    const { data: order, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .maybeSingle();
    if (error) throw error;

    await supabase.from("order_events").insert({
      order_id: orderId,
      status: toStatus,
      message: message || STATUS_MESSAGES[toStatus],
      actor: actor || "system",
    });

    // Free the driver up after delivery.
    if (toStatus === "delivered" && order?.driver_id) {
      await supabase.from("drivers").update({ status: "available" }).eq("id", order.driver_id);
    }

    return new Response(JSON.stringify({ ok: true, order }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
