import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, MapPin, Clock, Search, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import QtyButton from "@/components/QtyButton";
import SafeImage from "@/components/SafeImage";
import { ProductGridSkeleton } from "@/components/CustomerSkeletons";

import { PRODUCTS, discountPct, CATEGORIES, Category } from "@/data/products";

import storeGeneral from "@/assets/stores/general-store.jpg";
import storeFreshMart from "@/assets/stores/fresh-mart.jpg";
import storeGroceries from "@/assets/stores/groceries.jpg";
import storeDairy from "@/assets/stores/dairy.jpg";
import storeProvisions from "@/assets/stores/provisions.jpg";

const u = (id: string) => `https://images.unsplash.com/${id}?w=400&q=75&auto=format&fit=crop`;

// IMPORTANT: ids here MUST match `public.sellers.id` in Lovable Cloud DB.
// Mismatched ids cause the "Electronics card opens Fashion shop" bug.
const sellers = [
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, tags: ["Groceries", "Fast delivery"], items: 10, deliveryTime: "22 min", banner: storeGeneral, category: "Groceries" as const },
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, tags: ["Organic", "Top rated"], items: 10, deliveryTime: "18 min", banner: storeFreshMart, category: "Groceries" as const },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, tags: ["Nearest"], items: 9, deliveryTime: "25 min", banner: storeGroceries, category: "Groceries" as const },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, tags: ["Fresh daily"], items: 8, deliveryTime: "15 min", banner: storeDairy, category: "Dairy" as const },
  { id: "s5", name: "Ahmed Provisions", distance: "2.1 km", rating: 4.4, tags: ["Bulk orders"], items: 8, deliveryTime: "28 min", banner: storeProvisions, category: "Provisions" as const },
  { id: "s6", name: "Sweet Crust Bakery", distance: "1.7 km", rating: 4.9, tags: ["Bakery", "Fresh today"], items: 9, deliveryTime: "20 min", banner: u("photo-1509440159596-0249088772ff"), category: "Bakery" as const },
  { id: "s7", name: "Wellness Pharmacy", distance: "0.9 km", rating: 4.7, tags: ["Pharmacy", "24×7"], items: 8, deliveryTime: "18 min", banner: u("photo-1576602976047-174e57a47881"), category: "Pharmacy" as const },
  { id: "s8", name: "TechHub Electronics", distance: "1.4 km", rating: 4.5, tags: ["Electronics"], items: 8, deliveryTime: "25 min", banner: u("photo-1498049794561-7780e7231661"), category: "Electronics" as const },
  { id: "s9", name: "Threads & Trends", distance: "2.4 km", rating: 4.6, tags: ["Fashion"], items: 8, deliveryTime: "35 min", banner: u("photo-1483985988355-763728e1935b"), category: "Fashion" as const },
  { id: "s10", name: "Home Essentials Co.", distance: "1.8 km", rating: 4.6, tags: ["Home", "Cozy"], items: 10, deliveryTime: "28 min", banner: u("photo-1556909114-f6e7ad7d3136"), category: "Home" as const },
];

const products = PRODUCTS.slice(0, 12);
const localSpecials = PRODUCTS.filter((p) => ["p11", "p12", "p13"].includes(p.id));

const filters = ["Fast delivery", "Lowest price", "Top rated", "Nearest"] as const;
type FilterKey = typeof filters[number];

function sortProducts(list: typeof PRODUCTS, filter: FilterKey | null) {
  if (!filter) return list;
  const copy = [...list];
  if (filter === "Lowest price") return copy.sort((a, b) => a.price - b.price);
  if (filter === "Top rated") return copy.sort((a, b) => discountPct(b) - discountPct(a));
  return copy; // Fast delivery / Nearest fall back to original order (proximity-curated)
}

function sortSellers<T extends { rating: number; distance: string; deliveryTime: string }>(
  list: T[],
  filter: FilterKey | null
): T[] {
  if (!filter) return list;
  const copy = [...list];
  const num = (s: string) => parseFloat(s) || 0;
  if (filter === "Fast delivery") return copy.sort((a, b) => num(a.deliveryTime) - num(b.deliveryTime));
  if (filter === "Top rated") return copy.sort((a, b) => b.rating - a.rating);
  if (filter === "Nearest") return copy.sort((a, b) => num(a.distance) - num(b.distance));
  return copy;
}

export default function CustomerExplore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const validInitial = initialCategory && (CATEGORIES as string[]).includes(initialCategory) ? initialCategory : null;

  const [tab, setTab] = useState<"products" | "sellers" | "specials">(
    validInitial === "Specials" ? "specials" : "products"
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(validInitial);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const c = searchParams.get("category") as Category | null;
    if (c && (CATEGORIES as string[]).includes(c)) {
      setActiveCategory(c);
      if (c === "Specials") setTab("specials");
      else setTab("products");
    }
  }, [searchParams]);

  const clearCategory = () => {
    setActiveCategory(null);
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const matchesCategory = (p: typeof PRODUCTS[number]) =>
    !activeCategory || p.category === activeCategory;

  const filteredProducts = useMemo(() => {
    const base = activeCategory ? PRODUCTS.filter(matchesCategory) : products;
    const searched = !isSearching
      ? base
      : PRODUCTS.filter(
          (p) =>
            matchesCategory(p) &&
            (p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q))
        );
    return sortProducts(searched, activeFilter as FilterKey | null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, isSearching, activeCategory, activeFilter]);

  const filteredSellers = useMemo(() => {
    let base: typeof sellers;
    if (activeCategory) {
      const sellerIdsInCat = new Set(PRODUCTS.filter((p) => p.category === activeCategory).map((p) => p.sellerId));
      base = sellers.filter((s) => sellerIdsInCat.has(s.id));
    } else {
      base = sellers;
    }
    if (isSearching) base = base.filter((s) => s.name.toLowerCase().includes(q));
    return sortSellers(base, activeFilter as FilterKey | null);
  }, [q, isSearching, activeCategory, activeFilter]);

  const filteredSpecials = useMemo(() => {
    const base = activeCategory && activeCategory !== "Specials"
      ? localSpecials.filter((p) => p.category === activeCategory)
      : localSpecials;
    if (!isSearching) return base;
    return base.filter(
      (p) => p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q)
    );
  }, [q, isSearching, activeCategory]);

  const totalResults = filteredProducts.length + filteredSellers.length;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, stores..."
            className="pl-10 pr-12 h-12 rounded-2xl bg-card border-border shadow-sm text-sm font-medium placeholder:text-muted-foreground"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="text-[11px] text-muted-foreground mt-2 px-1 font-medium">
            {totalResults} result{totalResults === 1 ? "" : "s"} for{" "}
            <span className="font-bold text-foreground">"{query}"</span>
          </p>
        )}
      </div>

      {/* Category chips */}
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => {
                  if (active) {
                    clearCategory();
                  } else {
                    setActiveCategory(c);
                    const next = new URLSearchParams(searchParams);
                    next.set("category", c);
                    setSearchParams(next, { replace: true });
                    if (c === "Specials") setTab("specials");
                    else if (tab === "specials") setTab("products");
                  }
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 ${
                  active
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {activeCategory && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <p className="text-[11px] text-muted-foreground font-medium">
              Showing <span className="font-extrabold text-foreground">{activeCategory}</span>
            </p>
            <button
              onClick={clearCategory}
              className="inline-flex items-center gap-0.5 text-[11px] font-bold text-rose-500 active:scale-95"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-muted rounded-2xl p-1">
          {(["products", "sellers", "specials"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-sm py-2.5 rounded-xl transition-all font-semibold capitalize ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "specials" ? "Local ⭐" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(activeFilter === f ? null : f)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border active:scale-95 ${
              activeFilter === f
                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                : "bg-card text-muted-foreground border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="px-4 pb-4">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <PackageSearch className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different word or browse sellers</p>
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((p) => {
              const pct = discountPct(p);
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/customer/product/${p.id}`)}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="relative h-28 overflow-hidden bg-muted">
                    {pct > 0 && (
                      <span className="absolute top-2 left-2 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                        {pct}% OFF
                      </span>
                    )}
                    {pct === 0 && p.tag && (
                      <span className="absolute top-2 left-2 z-10 text-[9px] font-bold bg-card/90 text-foreground px-1.5 py-0.5 rounded-full">
                        {p.tag}
                      </span>
                    )}
                    <SafeImage src={p.image} category={p.category} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={256} height={160} />
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-bold text-foreground leading-snug">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.unit} · {p.seller}</p>
                    <div className="flex items-center justify-between mt-2">
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
          {!loading && filteredProducts.length > 0 && (
            <p className="text-[11px] text-muted-foreground text-center mt-4 font-medium">
              Prices set by sellers · No platform markup
            </p>
          )}
        </div>
      )}

      {tab === "sellers" && (
        <div className="px-4 space-y-3 pb-4">
          {filteredSellers.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <PackageSearch className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No sellers found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different name</p>
            </div>
          ) : filteredSellers.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="w-full text-left bg-card rounded-2xl overflow-hidden shadow-sm border border-border active:scale-[0.98] transition-transform"
            >
              <div className="h-28 overflow-hidden bg-muted">
                <SafeImage src={s.banner} category={s.category} alt={s.name} className="h-full w-full object-cover" loading="lazy" width={400} height={112} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[15px] font-bold text-foreground">{s.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-foreground">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{s.rating}
                      </span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />{s.distance}
                      </span>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-xs text-muted-foreground">{s.items} items</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {s.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {s.tags.map((t) => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === "specials" && (
        <div className="px-4 space-y-3 pb-4">
          <div className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 dark:from-amber-500/20 dark:to-orange-500/20 rounded-2xl p-4 border border-amber-500/30">
            <p className="text-sm font-bold text-foreground">🌟 Local Specials</p>
            <p className="text-xs text-muted-foreground mt-0.5">Unique products from your neighborhood</p>
          </div>
          {filteredSpecials.length === 0 && (
            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <PackageSearch className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No specials match</p>
            </div>
          )}
          {filteredSpecials.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 relative bg-muted">
                  {pct > 0 && (
                    <span className="absolute top-1 left-1 z-10 text-[8px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                      {pct}%
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={64} height={64} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{p.name}</p>
                    {p.tag && (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full">{p.tag}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{p.unit} · {p.seller}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-foreground">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">₹{p.originalPrice}</span>
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
      )}
    </div>
  );
}
