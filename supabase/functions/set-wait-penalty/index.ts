// Set the wait_penalty value on an order.
// Body: { orderId: string, penalty: number }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { orderId, penalty } = await req.json();
    if (!orderId || typeof penalty !== "number" || !isFinite(penalty)) {
      return new Response(JSON.stringify({ error: "orderId and numeric penalty required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const clamped = Math.max(0, Math.min(500, Math.round(penalty)));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.from("orders")
      .update({ wait_penalty: clamped }).eq("id", orderId);
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, penalty: clamped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
