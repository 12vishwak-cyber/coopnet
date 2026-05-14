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

function computeDeliveryFee(distanceKm: number, subtotal: number): number {
  if (subtotal <= 0) return 0;
  const base = 15;
  const extra = Math.max(0, distanceKm - 1) * 8;
  return Math.min(45, Math.round(base + extra));
}
const FREE_DELIVERY_THRESHOLD = 199;
const PLATFORM_FEE = 4;
const COMMUNITY_PCT = 0.06;

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
      discount: clientDiscount = 0,
      freeDelivery = false,
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

    // Server-side price recompute. Never trust client totals.
    const productIds = items
      .map((it: { id?: string }) => (typeof it.id === "string" ? it.id : null))
      .filter((id: string | null): id is string => !!id);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id, name, price, image, unit, seller_id")
      .in("id", productIds.length > 0 ? productIds : ["__none__"]);
    if (pErr) throw pErr;

    const priceMap = new Map<string, { price: number; name: string; image: string; unit: string; seller_id: string }>();
    for (const p of products ?? []) priceMap.set(p.id as string, p as never);

    let subtotal = 0;
    const verifiedItems = items.map((it: { id?: string; qty?: number }) => {
      const id = String(it.id ?? "");
      const qty = Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 0)));
      const p = priceMap.get(id);
      if (!p) throw new Error(`Unknown product: ${id}`);
      if (p.seller_id !== sellerId) throw new Error(`Product ${id} not from seller ${sellerId}`);
      subtotal += p.price * qty;
      return { id, name: p.name, price: p.price, image: p.image, unit: p.unit, qty };
    });
    subtotal = Math.round(subtotal);

    const discount = Math.max(0, Math.min(subtotal, Math.round(Number(clientDiscount) || 0)));
    const netGoods = subtotal - discount;

    const cLat = typeof customerLat === "number" ? customerLat : seller.lat + 0.012;
    const cLng = typeof customerLng === "number" ? customerLng : seller.lng + 0.008;
    const distanceKm = +haversineKm(seller.lat, seller.lng, cLat, cLng).toFixed(2);

    const rawDelivery = computeDeliveryFee(distanceKm, subtotal);
    const deliveryFee = freeDelivery || netGoods >= FREE_DELIVERY_THRESHOLD ? 0 : rawDelivery;
    const platformFee = subtotal > 0 ? PLATFORM_FEE : 0;
    const communityFund = Math.round(netGoods * COMMUNITY_PCT);
    const sellerEarnings = Math.max(0, netGoods - communityFund);
    const total = Math.max(0, netGoods + deliveryFee + platformFee);

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        short_code: shortCode(),
        customer_name: String(customerName).slice(0, 80),
        customer_lat: cLat,
        customer_lng: cLng,
        customer_address: String(customerAddress).slice(0, 200),
        seller_id: sellerId,
        status: "placed",
        items: verifiedItems,
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
