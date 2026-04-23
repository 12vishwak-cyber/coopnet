import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  History,
  ShieldCheck,
} from "lucide-react";
import PromoCarousel, { Banner } from "@/components/PromoCarousel";
import QtyButton from "@/components/QtyButton";
import {
  ProductGridSkeleton,
  HorizontalScrollSkeleton,
  CategoryRowSkeleton,
  BannerSkeleton,
} from "@/components/CustomerSkeletons";

import { CATEGORIES, CATEGORY_META, PRODUCTS, discountPct } from "@/data/products";
import { SELLERS } from "@/data/sellers";
import { buildNearYouFeed, pickContextualStrip, type FeedItem } from "@/lib/homeFeed";
import { useOrders } from "@/contexts/OrdersContext";

const u = (id: string) => `https://images.unsplash.com/${id}?w=600&q=75&auto=format&fit=crop`;

// 🎨 Hero banners stay — they're the marketing surface, not a product list
const promoBanners: Banner[] = [
  {
    title: "Fresh bakery in 15 mins 🍞",
    subtitle: "Croissants, sourdough & cakes — straight from the oven",
    image: u("photo-1509440159596-0249088772ff"),
    overlay: "from-rose-600/85 via-rose-500/40 to-transparent",
    cta: "Order Now",
    badge: "NEW",
  },
  {
    title: "Flat ₹50 OFF essentials 🛒",
    subtitle: "Use SAVE50 · Min order ₹300",
    image: u("photo-1604908176997-125f25cc6f3d"),
    overlay: "from-violet-700/85 via-violet-500/30 to-transparent",
    cta: "Apply Coupon",
    badge: "FLAT ₹50",
  },
  {
    title: "Support local stores ❤️",
    subtitle: "Every order helps your community",
    image: u("photo-1565299624946-b28f40a0ae38"),
    overlay: "from-emerald-700/90 via-emerald-500/40 to-transparent",
    cta: "Explore",
  },
];

// Recent searches stored locally so they feel like the user's history
const RECENT_KEY = "coopnet:recentSearches:v1";
function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) return (JSON.parse(raw) as string[]).slice(0, 6);
  } catch {
    /* ignore */
  }
  // Sensible defaults so first-time users don't see an empty state
  return ["milk", "tomatoes", "bread", "paneer"];
}

// "X stores nearby" — derive from sellers that actually carry the category
const storesPerCategory = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
  const sellerIds = new Set(PRODUCTS.filter((p) => p.category === cat).map((p) => p.sellerId));
  acc[cat] = sellerIds.size;
  return acc;
}, {});

export default function CustomerHome() {
  const navigate = useNavigate();
  const { pastOrders } = useOrders();
  const [loading, setLoading] = useState(true);
  const [recent] = useState(loadRecentSearches);

  // Brief skeleton on first paint
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(t);
  }, []);

  // Build the dynamic mixed feed once per mount (rank seed shifts every 6h)
  const feed = useMemo<FeedItem[]>(() => buildNearYouFeed(14), []);

  // Single contextual strip — picks based on time + history
  const pastIds = useMemo(
    () => Array.from(new Set(pastOrders.flatMap((o) => o.items.map((i) => i.id)))),
    [pastOrders],
  );
  const strip = useMemo(() => pickContextualStrip({ pastOrderProductIds: pastIds }), [pastIds]);

  const sellersSupported = new Set(pastOrders.flatMap((o) => o.items.map((i) => i.seller))).size;

  return (
    <div className="space-y-5 pb-6">
      {/* 1️⃣ SEARCH BAR + recent searches */}
      <div className="px-4 pt-3 space-y-2">
        <button
          onClick={() => navigate("/customer/explore")}
          className="w-full flex items-center gap-3 bg-card rounded-2xl px-4 py-3 shadow-sm border border-border text-left active:scale-[0.98] transition-transform"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            Search for milk, fruits, stores…
          </span>
        </button>
        {recent.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            <History className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide shrink-0">
              Recent
            </span>
            {recent.map((q) => (
              <button
                key={q}
                onClick={() => navigate(`/customer/explore?q=${encodeURIComponent(q)}`)}
                className="text-[11px] font-semibold text-foreground bg-muted px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-accent transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2️⃣ CATEGORIES with stores-nearby count */}
      <div className="px-4">
        {loading ? (
          <CategoryRowSkeleton />
        ) : (
          <div className="flex gap-3.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((name) => {
              const meta = CATEGORY_META[name];
              const count = storesPerCategory[name] ?? 0;
              return (
                <button
                  key={name}
                  onClick={() => navigate(`/customer/explore?category=${encodeURIComponent(name)}`)}
                  className="flex flex-col items-center gap-1.5 min-w-[68px] active:scale-95 transition-transform"
                >
                  <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10 bg-muted">
                    <img
                      src={meta.image}
                      alt={name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width={64}
                      height={64}
                    />
                    <span
                      className={`absolute top-1 right-1 ${meta.labelClass} text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm leading-none`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-foreground/90 text-center leading-tight">
                    {name}
                  </span>
                  {count > 0 && (
                    <span className="text-[9px] text-muted-foreground -mt-1">
                      {count} {count === 1 ? "store" : "stores"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 🎨 Promo banners (single carousel — kept slim) */}
      <div className="px-4">
        {loading ? (
          <BannerSkeleton />
        ) : (
          <PromoCarousel
            banners={promoBanners}
            onTap={(i) => {
              if (i === 0) navigate("/customer/explore?category=Bakery");
              else if (i === 1) navigate("/customer/cart");
              else navigate("/customer/explore");
            }}
          />
        )}
      </div>

      {/* 3️⃣ NEAR YOU NOW — primary mixed feed (the heart of the home) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Near You Now
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Ranked by distance, freshness & demand
            </p>
          </div>
          <button
            onClick={() => navigate("/customer/explore")}
            className="text-xs font-bold text-primary flex items-center gap-0.5"
          >
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="space-y-3">
            {feed.map((item, idx) =>
              item.kind === "product" ? (
                <FeedProductCard key={`fp-${item.product.id}-${idx}`} item={item} />
              ) : (
                <FeedSellerCard key={`fs-${item.seller.id}-${idx}`} item={item} />
              ),
            )}
          </div>
        )}
      </div>

      {/* 4️⃣ ONE contextual strip — adapts to time-of-day + user history */}
      {strip.products.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{strip.emoji}</span>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight">
                  {strip.title}
                </h2>
                <p className="text-[10px] text-muted-foreground">{strip.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/customer/explore")}
              className="text-xs font-bold text-primary flex items-center gap-0.5"
            >
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {loading ? (
            <HorizontalScrollSkeleton />
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {strip.products.map((p) => {
                const pct = discountPct(p);
                return (
                  <div
                    key={`strip-${p.id}`}
                    onClick={() => navigate(`/customer/product/${p.id}`)}
                    className="min-w-[150px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="relative h-24 overflow-hidden bg-muted">
                      {pct > 0 && (
                        <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                          {pct}%
                        </span>
                      )}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2.5 flex flex-col flex-1">
                      <p className="text-[12px] font-bold text-foreground leading-snug truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {p.unit} · {p.seller}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-1.5">
                        <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                        <QtyButton
                          item={{
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            unit: p.unit,
                            seller: p.seller,
                            image: p.image,
                          }}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5️⃣ SUBTLE IMPACT CARD — only after some history */}
      {sellersSupported > 0 && (
        <div className="px-4">
          <button
            onClick={() => navigate("/customer/network")}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Heart className="h-4 w-4 text-emerald-600 dark:text-emerald-400 fill-emerald-500/30" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground leading-tight">
                You supported {sellersSupported} local{" "}
                {sellersSupported === 1 ? "seller" : "sellers"} this week
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">See your full impact →</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Subcomponents ───────────────────────── */

function FeedProductCard({ item }: { item: Extract<FeedItem, { kind: "product" }> }) {
  const navigate = useNavigate();
  const p = item.product;
  const pct = discountPct(p);

  return (
    <div
      onClick={() => navigate(`/customer/product/${p.id}`)}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="relative h-[110px] w-[110px] shrink-0 bg-muted">
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover"
          loading="lazy"
          width={110}
          height={110}
        />
        {pct > 0 && (
          <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
            {pct}% OFF
          </span>
        )}
        {item.freshness && (
          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-card/90 text-foreground backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
            {item.freshness}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 p-3 flex flex-col">
        <p className="text-[13px] font-bold text-foreground leading-snug truncate">{p.name}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer/seller/${p.sellerId}`);
          }}
          className="text-[11px] text-primary font-semibold leading-tight truncate text-left mt-0.5"
        >
          {p.seller}
        </button>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
          <span className="flex items-center gap-0.5">
            <MapPin className="h-2.5 w-2.5" /> {item.distanceKm.toFixed(1)} km
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" /> {item.etaMin} min
          </span>
        </div>
        {/* Subtle earnings preview — the "deep layer" peek */}
        <p className="text-[9.5px] text-muted-foreground mt-1 leading-tight">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            ₹{item.sellerEarnings} seller
          </span>{" "}
          ·{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            ₹{item.driverEarnings} driver
          </span>{" "}
          · ₹{item.systemFee} system
        </p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-foreground">₹{p.price}</span>
            {p.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                ₹{p.originalPrice}
              </span>
            )}
          </div>
          <QtyButton
            item={{
              id: p.id,
              name: p.name,
              price: p.price,
              unit: p.unit,
              seller: p.seller,
              image: p.image,
            }}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}

function FeedSellerCard({ item }: { item: Extract<FeedItem, { kind: "seller" }> }) {
  const navigate = useNavigate();
  const s = item.seller;
  return (
    <button
      onClick={() => navigate(`/customer/seller/${s.id}`)}
      className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex items-stretch cursor-pointer active:scale-[0.99] transition-transform text-left"
    >
      <div className="relative h-[88px] w-[110px] shrink-0 bg-muted">
        <img
          src={s.image}
          alt={s.name}
          className="h-full w-full object-cover"
          loading="lazy"
          width={110}
          height={88}
        />
      </div>
      <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            Featured store
          </span>
        </div>
        <p className="text-[14px] font-extrabold text-foreground leading-tight mt-0.5 truncate">
          {s.name}
        </p>
        <p className="text-[11px] text-muted-foreground leading-tight truncate">
          {item.highlight}
        </p>
        <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground mt-1">
          <span className="flex items-center gap-0.5">
            <MapPin className="h-2.5 w-2.5" /> {s.distanceKm.toFixed(1)} km
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" /> {item.etaMin} min
          </span>
          {s.trust > 0.85 && (
            <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-2.5 w-2.5" /> Trusted
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center pr-3">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}
