// Insert one or more products on behalf of a seller.
// Body: { sellerId: string, products: Array<ProductInput> }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_CATEGORIES = new Set([
  "Groceries", "Dairy", "Provisions", "Bakery", "Vegetables",
  "Fruits", "Meat", "Snacks", "Beverages", "Household", "Other",
]);

interface ProductInput {
  id?: string;
  name: string;
  description?: string | null;
  category?: string;
  unit?: string;
  price: number;
  original_price?: number | null;
  image?: string;
  gallery_images?: string[];
  in_stock?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { sellerId, products } = await req.json();
    if (!sellerId || !Array.isArray(products) || products.length === 0) {
      return new Response(JSON.stringify({ error: "sellerId and products[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (products.length > 200) {
      return new Response(JSON.stringify({ error: "Too many products in one request" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: seller } = await supabase
      .from("sellers").select("id").eq("id", sellerId).maybeSingle();
    if (!seller) {
      return new Response(JSON.stringify({ error: "Unknown seller" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = (products as ProductInput[]).map((p, i) => {
      const name = String(p.name ?? "").trim().slice(0, 120);
      if (!name) throw new Error(`Row ${i}: name required`);
      const price = Number(p.price);
      if (!isFinite(price) || price < 0 || price > 1_000_000) {
        throw new Error(`Row ${i}: invalid price`);
      }
      const category = ALLOWED_CATEGORIES.has(String(p.category)) ? p.category : "Other";
      return {
        id: p.id ?? `p_${sellerId}_${Date.now()}_${i}`,
        seller_id: sellerId,
        name,
        description: (p.description ?? "").toString().slice(0, 500) || null,
        category,
        unit: (p.unit ?? "1 pc").toString().slice(0, 40),
        price,
        original_price: p.original_price != null && isFinite(Number(p.original_price))
          ? Number(p.original_price) : null,
        image: (p.image ?? "/placeholder.svg").toString().slice(0, 500),
        gallery_images: Array.isArray(p.gallery_images)
          ? p.gallery_images.slice(0, 6).map((u) => String(u).slice(0, 500))
          : [],
        in_stock: p.in_stock !== false,
      };
    });

    const { data, error } = await supabase.from("products").insert(rows).select();
    if (error) throw error;
    return new Response(JSON.stringify({ products: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
