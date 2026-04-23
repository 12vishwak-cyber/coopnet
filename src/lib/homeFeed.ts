// "Near You Now" feed — ranks a mixed list of products and sellers using
// proximity + freshness + demand + trust. Randomness is daily-stable so the
// feed feels alive but doesn't shuffle on every render.

import { PRODUCTS, type Product } from "@/data/products";
import { SELLERS, SELLER_BY_ID, type SellerInfo, previewDriverPay } from "@/data/sellers";
import { computePricing } from "@/lib/pricing";

export type FeedProduct = {
  kind: "product";
  product: Product;
  seller: SellerInfo;
  etaMin: number;
  distanceKm: number;
  sellerEarnings: number;
  driverEarnings: number;
  systemFee: number;
  freshness: "Fresh today" | "Just in" | "Hot batch" | null;
  rank: number;
};

export type FeedSeller = {
  kind: "seller";
  seller: SellerInfo;
  highlight: string;
  etaMin: number;
  rank: number;
};

export type FeedItem = FeedProduct | FeedSeller;

// Cheap deterministic hash so a given (id, daySeed) always returns same value
function hash(s: string, salt: number): number {
  let h = salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 1000 / 1000; // 0..1
}

// Returns a "mood" tag that varies during the day
function freshnessFor(p: Product, daySeed: number): FeedProduct["freshness"] {
  const cats = ["Bakery", "Dairy", "Vegetables", "Fruits"];
  if (!cats.includes(p.category)) return null;
  const r = hash(p.id, daySeed);
  if (r < 0.33) return "Fresh today";
  if (r < 0.66) return "Just in";
  return "Hot batch";
}

export function buildNearYouFeed(limit = 12): FeedItem[] {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 6)); // shifts every 6h

  const productItems: FeedProduct[] = PRODUCTS.map((p) => {
    const seller = SELLER_BY_ID[p.sellerId] ?? SELLERS[0];
    const distanceKm = seller.distanceKm;
    const pricing = computePricing({ subtotal: p.price, distanceKm });
    const driverPay = previewDriverPay(distanceKm);

    // Ranking signals (all 0..1):
    const proximity = 1 - Math.min(1, distanceKm / 3); // closer = better
    const trust = seller.trust;
    const demand = hash(p.id, day);                     // synthetic demand
    const freshness = ["Bakery", "Dairy", "Vegetables", "Fruits"].includes(p.category) ? 0.85 : 0.5;
    const availability = hash(p.id + "stk", day) > 0.08 ? 1 : 0; // 8% out-of-stock
    const rank = availability * (proximity * 0.35 + freshness * 0.2 + demand * 0.25 + trust * 0.2);

    return {
      kind: "product" as const,
      product: p,
      seller,
      etaMin: seller.etaMin + Math.round(hash(p.id + "eta", day) * 4 - 2),
      distanceKm,
      sellerEarnings: pricing.sellerEarnings,
      driverEarnings: driverPay,
      systemFee: pricing.platformFee,
      freshness: freshnessFor(p, day),
      rank,
    };
  }).filter((it) => it.rank > 0);

  // Inject 1 seller card every ~5 product slots, ranked by trust + proximity
  const sellerItems: FeedSeller[] = SELLERS.slice(0, 6).map((s, i) => ({
    kind: "seller" as const,
    seller: s,
    highlight:
      s.tag === "Nearest"
        ? "Closest store right now"
        : s.tag === "Hot"
        ? "Baking fresh batches"
        : s.trust > 0.9
        ? "Trusted local seller"
        : "Loved by neighbors",
    etaMin: s.etaMin,
    rank: (1 - s.distanceKm / 3) * 0.6 + s.trust * 0.4 - i * 0.02,
  }));

  // Sort + interleave
  const sortedProducts = productItems.sort((a, b) => b.rank - a.rank);
  const sortedSellers = sellerItems.sort((a, b) => b.rank - a.rank);

  const interleaved: FeedItem[] = [];
  let pi = 0;
  let si = 0;
  for (let i = 0; i < limit; i++) {
    if ((i + 1) % 5 === 0 && si < sortedSellers.length) {
      interleaved.push(sortedSellers[si++]);
    } else if (pi < sortedProducts.length) {
      interleaved.push(sortedProducts[pi++]);
    }
  }
  return interleaved;
}

export type Strip = {
  id: "popular" | "buy-again" | "breakfast" | "dinner";
  title: string;
  subtitle: string;
  emoji: string;
  products: Product[];
};

// Picks ONE contextual strip: time-of-day for returning users, popular otherwise.
export function pickContextualStrip(args: {
  pastOrderProductIds: string[];
}): Strip {
  const hour = new Date().getHours();
  const isReturning = args.pastOrderProductIds.length > 0;

  // Morning 5–11 → breakfast. Evening 17–22 → dinner.
  if (hour >= 5 && hour < 11) {
    const products = PRODUCTS.filter((p) =>
      ["Bakery", "Dairy", "Beverages"].includes(p.category) ||
      /idli|bread|milk|curd|coffee|croissant/i.test(p.name)
    ).slice(0, 8);
    return { id: "breakfast", title: "Breakfast near you", subtitle: "Hot & fresh, arriving in minutes", emoji: "☀️", products };
  }
  if (hour >= 17 && hour < 22) {
    const products = PRODUCTS.filter((p) =>
      ["Vegetables", "Essentials", "Specials"].includes(p.category) ||
      /paneer|rice|oil|pickle|flour/i.test(p.name)
    ).slice(0, 8);
    return { id: "dinner", title: "Dinner near you", subtitle: "Stock up before the evening rush", emoji: "🌙", products };
  }

  if (isReturning) {
    const products = PRODUCTS.filter((p) => args.pastOrderProductIds.includes(p.id)).slice(0, 8);
    if (products.length >= 3) {
      return { id: "buy-again", title: "Buy again", subtitle: "Reorder your usuals in one tap", emoji: "🔁", products };
    }
  }

  return {
    id: "popular",
    title: "Popular near you",
    subtitle: "Trending picks from sellers around you",
    emoji: "🔥",
    products: PRODUCTS.slice(0, 8),
  };
}
