// supabase/functions/parse-product-image/index.ts
// Uses Lovable AI Gateway to OCR a product/bill image into a structured product list.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface DetectedItem {
  name: string;
  qty?: string;
  price?: number;
}

const MODEL = "google/gemini-2.5-flash";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "imageBase64 required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const dataUrl = `data:${mimeType ?? "image/jpeg"};base64,${imageBase64}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an OCR helper for kirana store owners. Extract product line items from a supplier bill, handwritten list, or shelf photo. Respond ONLY with JSON of shape {\"items\":[{\"name\":string,\"qty\":string|null,\"price\":number|null}]}. Use Indian rupees as numbers (no symbol). Skip totals/tax lines.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract every product. Return JSON only." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      return new Response(
        JSON.stringify({ error: `AI gateway ${aiResp.status}: ${txt.slice(0, 200)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiResp.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";
    let items: DetectedItem[] = [];
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const json = JSON.parse(cleaned);
      items = Array.isArray(json?.items) ? json.items : [];
    } catch (_e) {
      // Fallback: simple line parse
      items = raw
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean)
        .slice(0, 30)
        .map((line: string) => ({ name: line }));
    }

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
