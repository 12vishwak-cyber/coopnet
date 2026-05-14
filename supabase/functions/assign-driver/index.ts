// Cooperative driver-assignment engine.
//
// Strategy: combine PROXIMITY (closest available driver to the seller pickup)
// with CO-OP FAIRNESS ROTATION (drivers idle longest get a boost so earnings
// spread across the network). Returns the chosen driver plus the score
// breakdown so the client can render a "Why this driver?" explanation.
//
// Inputs (POST JSON): { orderId: string, sellerLat: number, sellerLng: number }
// Output: { driver, factors: { distance, rating, idleHours, score }, ranked: [...] }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { orderId, sellerLat, sellerLng } = body ?? {};
    if (!orderId || typeof sellerLat !== "number" || typeof sellerLng !== "number") {
      return new Response(JSON.stringify({ error: "orderId, sellerLat, sellerLng required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Pull all available drivers — if none, fall back to the full pool so the
    // co-op rotation still finds the longest-idle driver instead of stalling.
    let { data: drivers, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("status", "available");
    if (error) throw error;
    if (!drivers || drivers.length === 0) {
      const { data: all, error: e2 } = await supabase.from("drivers").select("*");
      if (e2) throw e2;
      drivers = all ?? [];
    }
    if (!drivers || drivers.length === 0) {
      return new Response(JSON.stringify({ error: "No drivers in network" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const ranked = drivers
      .map((d) => {
        const distance = haversineKm(sellerLat, sellerLng, d.current_lat, d.current_lng);
        const lastTs = d.last_assigned_at ? new Date(d.last_assigned_at).getTime() : 0;
        const idleHours = lastTs ? (now - lastTs) / 3_600_000 : 24;
        // Lower score = better. Distance (km) dominates; idle bonus subtracts; rating subtracts.
        const score =
          distance * 1.0 // 1 point per km
          - Math.min(idleHours, 6) * 0.15 // up to -0.9 for 6+h idle (fairness)
          - (d.rating - 4.5) * 0.4; // small bonus for highly-rated drivers
        return { driver: d, distance, idleHours, score };
      })
      .sort((a, b) => a.score - b.score);

    const winner = ranked[0];
    const distanceKm = +winner.distance.toFixed(2);

    // Update order + driver in one shot.
    const reason = {
      distance: distanceKm,
      rating: Number(winner.driver.rating),
      idleHours: +winner.idleHours.toFixed(2),
      score: +winner.score.toFixed(3),
      considered: ranked.length,
      explanation: `Closest available driver (${distanceKm} km) with rating ${winner.driver.rating}★. ${
        winner.idleHours >= 2
          ? `Co-op rotation: idle ${winner.idleHours.toFixed(1)}h — fairness boost applied.`
          : "Recently active — proximity-led match."
      }`,
    };

    const baseFare = 20;
    const perKmRate = 12;
    const driverEarnings = Math.max(25, Math.round(baseFare + distanceKm * perKmRate));

    await supabase
      .from("orders")
      .update({
        driver_id: winner.driver.id,
        status: "assigned",
        assignment_reason: reason,
        distance_km: distanceKm,
        driver_earnings: driverEarnings,
      })
      .eq("id", orderId);

    await supabase
      .from("drivers")
      .update({ status: "busy", last_assigned_at: new Date().toISOString() })
      .eq("id", winner.driver.id);

    await supabase.from("order_events").insert({
      order_id: orderId,
      status: "assigned",
      message: `${winner.driver.name} assigned (${distanceKm} km away, ${winner.driver.rating}★)`,
      actor: "system",
    });

    return new Response(
      JSON.stringify({
        driver: winner.driver,
        factors: reason,
        ranked: ranked.slice(0, 5).map((r) => ({
          id: r.driver.id,
          name: r.driver.name,
          distance: +r.distance.toFixed(2),
          rating: r.driver.rating,
          idleHours: +r.idleHours.toFixed(2),
          score: +r.score.toFixed(3),
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
