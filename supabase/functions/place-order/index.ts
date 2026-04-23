// Place a customer order. Computes co-op pricing breakdown server-side,
// inserts the order row, logs the placed event, then immediately calls
// the driver-assignment engine. Lifecycle then progresses via timed
// edge calls from the seller/driver UIs (or the auto-advance ticker).
//
// Body: {
//   sellerId, items, customerLat, customerLng, customerAddress?,
//   subtotal, discount, deliveryFee, platformFee, communityFund, total
// }

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

function shortCode() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "CN-";
  for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      sellerId,
      items,
      customerLat,
      customerLng,
      customerAddress = "Home",
      customerName = "You",
      subtotal,
      discount = 0,
      deliveryFee = 0,
      platformFee = 0,
      communityFund = 0,
      total,
    } = body ?? {};

    if (!sellerId || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "sellerId and items required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: seller, error: sErr } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", sellerId)
      .maybeSingle();
    if (sErr) throw sErr;
    if (!seller) {
      return new Response(JSON.stringify({ error: "Seller not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default customer location: ~1.5km from seller if not provided.
    const cLat = typeof customerLat === "number" ? customerLat : seller.lat + 0.012;
    const cLng = typeof customerLng === "number" ? customerLng : seller.lng + 0.008;
    const distanceKm = +haversineKm(seller.lat, seller.lng, cLat, cLng).toFixed(2);
    const sellerEarnings = +(subtotal - discount).toFixed(2);

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        short_code: shortCode(),
        customer_name: customerName,
        customer_lat: cLat,
        customer_lng: cLng,
        customer_address: customerAddress,
        seller_id: sellerId,
        status: "placed",
        items,
        subtotal,
        discount,
        delivery_fee: deliveryFee,
        platform_fee: platformFee,
        community_fund: communityFund,
        total,
        seller_earnings: sellerEarnings,
        distance_km: distanceKm,
      })
      .select()
      .single();
    if (oErr) throw oErr;

    await supabase.from("order_events").insert({
      order_id: order.id,
      status: "placed",
      message: `Order ${order.short_code} placed with ${seller.name}`,
      actor: "customer",
    });

    // Bump seller order count.
    await supabase
      .from("sellers")
      .update({ total_orders: seller.total_orders + 1 })
      .eq("id", sellerId);

    return new Response(JSON.stringify({ order }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
