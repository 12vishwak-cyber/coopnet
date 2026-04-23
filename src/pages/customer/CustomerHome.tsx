import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Flame, TrendingUp, Heart, Tag, Sparkles, Pill, Shirt } from "lucide-react";
import PromoCarousel, { Banner } from "@/components/PromoCarousel";
import QtyButton from "@/components/QtyButton";
import { ProductGridSkeleton, HorizontalScrollSkeleton, CategoryRowSkeleton, BannerSkeleton } from "@/components/CustomerSkeletons";

import { PRODUCTS, discountPct, CATEGORIES, CATEGORY_META } from "@/data/products";

// Store images
import storeFreshMart from "@/assets/stores/fresh-mart.jpg";
import storeGeneral from "@/assets/stores/general-store.jpg";
import storeDairy from "@/assets/stores/dairy.jpg";
import storeGroceries from "@/assets/stores/groceries.jpg";

const u = (id: string) => `https://images.unsplash.com/${id}?w=600&q=75&auto=format&fit=crop`;

// 🎨 Zepto-style banners with real product imagery + bright gradients
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
    title: "Pharmacy delivered fast 💊",
    subtitle: "Medicines, vitamins & essentials in 20 mins",
    image: u("photo-1576602976047-174e57a47881"),
    overlay: "from-red-600/85 via-red-500/35 to-transparent",
    cta: "Browse",
    badge: "24×7",
  },
  {
    title: "Support local stores ❤️",
    subtitle: "Every order helps your community",
    image: u("photo-1565299624946-b28f40a0ae38"),
    overlay: "from-emerald-700/90 via-emerald-500/40 to-transparent",
    cta: "Explore",
  },
  {
    title: "Tech in 20 mins 📱",
    subtitle: "Earbuds, chargers & accessories",
    image: u("photo-1606220945770-b5b6c2c55bf1"),
    overlay: "from-indigo-700/90 via-indigo-500/40 to-transparent",
    cta: "Shop Tech",
  },
];

// Pull category visuals from the central CATEGORY_META map
const categories = CATEGORIES.map((name) => ({
  name,
  ...CATEGORY_META[name],
}));

const popularProducts = PRODUCTS.slice(0, 8);
const urgencyById: Record<string, string> = {
  p1: "Selling fast 🔥",
  p3: "Bestseller ⭐",
  p5: "Only 4 left",
  p7: "Fresh today 🌿",
};
const recommended = [...PRODUCTS].slice(8, 14);

// Curated category showcases — drives the new categories without bloating Home
const bakeryProducts = PRODUCTS.filter((p) => p.category === "Bakery").slice(0, 4);
const pharmacyProducts = PRODUCTS.filter((p) => p.category === "Pharmacy").slice(0, 4);
const fashionProducts = PRODUCTS.filter((p) => p.category === "Fashion").slice(0, 4);

const featuredStores = [
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, deliveryTime: "18 min", image: storeFreshMart, tag: "Organic" },
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, deliveryTime: "22 min", image: storeGeneral, tag: "Trusted" },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, deliveryTime: "15 min", image: storeDairy, tag: "Fresh Daily" },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, deliveryTime: "25 min", image: storeGroceries, tag: "Nearest" },
];

const buyAgain = PRODUCTS.filter((p) => ["p2", "p7", "p8", "p3"].includes(p.id));
const trending = PRODUCTS.filter((p) => ["p5", "p4", "p6", "p1"].includes(p.id));

export default function CustomerHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Brief skeleton on first paint to feel like real data fetch
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="space-y-5 pb-6">
      {/* Search Bar */}
      <div className="px-4 pt-3">
        <button
          onClick={() => navigate("/customer/explore")}
          className="w-full flex items-center gap-3 bg-card rounded-2xl px-4 py-3 shadow-sm border border-border text-left active:scale-[0.98] transition-transform"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">Search for milk, fruits, snacks...</span>
        </button>
      </div>

      {/* Promo code banner */}
      <div className="px-4">
        <button
          onClick={() => navigate("/customer/cart")}
          className="w-full flex items-center gap-2.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/30 rounded-2xl px-3.5 py-2.5 active:scale-[0.99] transition-transform"
        >
          <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Tag className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-extrabold text-amber-700 dark:text-amber-300 leading-tight">
              Use <span className="font-mono">WELCOME10</span> for 10% off
            </p>
            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/70">Or try FREEDEL · SAVE50 at checkout</p>
          </div>
          <ChevronRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </button>
      </div>

      {/* Promo Banners — auto-rotating Zepto-style heroes */}
      <div className="px-4">
        {loading ? (
          <BannerSkeleton />
        ) : (
          <PromoCarousel
            banners={promoBanners}
            onTap={(i) => {
              if (i === 0) navigate("/customer/explore?category=Bakery");
              else if (i === 1) navigate("/customer/cart");
              else if (i === 2) navigate("/customer/explore?category=Pharmacy");
              else if (i === 4) navigate("/customer/explore?category=Electronics");
              else navigate("/customer/explore");
            }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="px-4">
        {loading ? (
          <CategoryRowSkeleton />
        ) : (
          <div className="flex gap-3.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/customer/explore?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center gap-1.5 min-w-[64px] active:scale-95 transition-transform"
              >
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10 bg-muted">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" loading="lazy" width={64} height={64} />
                  <span className={`absolute top-1 right-1 ${cat.labelClass} text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm leading-none`}>
                    {cat.label}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-foreground/90 text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Products */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <h2 className="text-base font-extrabold text-foreground">Popular Right Now</h2>
          </div>
          <button onClick={() => navigate("/customer/explore")} className="text-xs font-bold text-primary flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {popularProducts.map((p) => {
              const pct = discountPct(p);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/customer/product/${p.id}`)}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="relative h-28 overflow-hidden bg-muted">
                    {pct > 0 && (
                      <span className="absolute top-2 left-2 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                        {pct}% OFF
                      </span>
                    )}
                    {pct === 0 && p.tag && (
                      <span className="absolute top-2 left-2 z-10 text-[9px] font-bold bg-card/90 text-foreground backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                        {p.tag}
                      </span>
                    )}
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={256} height={160} />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[13px] font-bold text-foreground leading-snug">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.unit} · {p.seller}</p>
                    {urgencyById[p.id] && (
                      <p className="text-[10px] font-extrabold text-rose-500 mt-0.5">{urgencyById[p.id]}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-foreground">₹{p.price}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{p.originalPrice}</span>
                        )}
                      </div>
                      <QtyButton
                        item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buy Again */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          <h2 className="text-base font-extrabold text-foreground">Buy Again</h2>
        </div>
        {loading ? (
          <HorizontalScrollSkeleton />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {buyAgain.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="min-w-[140px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="h-24 overflow-hidden bg-muted">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={140} height={96} />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="text-[12px] font-bold text-foreground leading-snug truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{p.unit}</p>
                  <div className="flex items-center justify-between mt-auto pt-1.5">
                    <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                    <QtyButton
                      item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🍞 Bakery Showcase — new category */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🍞</span>
            <h2 className="text-base font-extrabold text-foreground">Fresh from the bakery</h2>
          </div>
          <button onClick={() => navigate("/customer/explore?category=Bakery")} className="text-xs font-bold text-primary flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {bakeryProducts.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={`bk-${p.id}`}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="min-w-[150px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-24 overflow-hidden bg-muted">
                  {pct > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                      {pct}%
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="text-[12px] font-bold text-foreground leading-snug truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{p.unit} · {p.seller}</p>
                  <div className="flex items-center justify-between mt-auto pt-1.5">
                    <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                    <QtyButton
                      item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 💊 Pharmacy showcase */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-extrabold text-foreground">Pharmacy & wellness</h2>
          </div>
          <button onClick={() => navigate("/customer/explore?category=Pharmacy")} className="text-xs font-bold text-primary flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {pharmacyProducts.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={`ph-${p.id}`}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="min-w-[150px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-24 overflow-hidden bg-muted">
                  {pct > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                      {pct}%
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="text-[12px] font-bold text-foreground leading-snug truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{p.unit}</p>
                  <div className="flex items-center justify-between mt-auto pt-1.5">
                    <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                    <QtyButton
                      item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 👕 Fashion showcase */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shirt className="h-4 w-4 text-pink-500" />
            <h2 className="text-base font-extrabold text-foreground">Fashion picks</h2>
          </div>
          <button onClick={() => navigate("/customer/explore?category=Fashion")} className="text-xs font-bold text-primary flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {fashionProducts.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={`fa-${p.id}`}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="min-w-[150px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-32 overflow-hidden bg-muted">
                  {pct > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                      {pct}% OFF
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="text-[12px] font-bold text-foreground leading-snug truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{p.seller}</p>
                  <div className="flex items-center justify-between mt-auto pt-1.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[9px] text-muted-foreground line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <QtyButton
                      item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-orange-500" />
          <h2 className="text-base font-extrabold text-foreground">Trending in your area</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {trending.map((p) => (
            <div
              key={`tr-${p.id}`}
              onClick={() => navigate(`/customer/product/${p.id}`)}
              className="min-w-[140px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="relative h-24 overflow-hidden bg-muted">
                {p.tag && (
                  <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold bg-card/90 text-foreground backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                    {p.tag}
                  </span>
                )}
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={140} height={96} />
              </div>
              <div className="p-2.5 flex flex-col flex-1">
                <p className="text-[12px] font-bold text-foreground leading-snug truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.unit}</p>
                <div className="flex items-center justify-between mt-auto pt-1.5">
                  <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                  <QtyButton
                    item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for you */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <h2 className="text-base font-extrabold text-foreground">Recommended for you</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recommended.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={`rec-${p.id}`}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="min-w-[140px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-24 overflow-hidden bg-muted">
                  {pct > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                      {pct}% OFF
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={140} height={96} />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="text-[12px] font-bold text-foreground leading-snug truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{p.unit}</p>
                  <div className="flex items-center justify-between mt-auto pt-1.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-foreground">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[9px] text-muted-foreground line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <QtyButton
                      item={{ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Local Stores */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-foreground">Local Stores Near You</h2>
          <button onClick={() => navigate("/customer/explore")} className="text-xs font-bold text-primary flex items-center gap-0.5">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {featuredStores.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="min-w-[180px] bg-card rounded-2xl overflow-hidden shadow-sm border border-border text-left active:scale-[0.98] transition-transform"
            >
              <div className="h-24 overflow-hidden bg-muted">
                <img src={s.image} alt={s.name} className="h-full w-full object-cover" loading="lazy" width={180} height={96} />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-foreground truncate">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                  <span className="font-bold">⭐ {s.rating}</span>
                  <span>·</span>
                  <span>{s.distance}</span>
                  <span>·</span>
                  <span>{s.deliveryTime}</span>
                </div>
                <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  {s.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
