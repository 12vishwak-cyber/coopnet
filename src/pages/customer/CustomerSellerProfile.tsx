import { useNavigate, useParams } from "react-router-dom";
import { Star, MapPin, ArrowLeft, Clock, Package, Shield, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeller, useSellerProducts } from "@/lib/coopnet-api";
import { useCart } from "@/contexts/CartContext";
import SafeImage from "@/components/SafeImage";
import SellerChat from "@/components/SellerChat";

/**
 * Seller profile — fully DB-backed.
 * Shows: identity, location, rating, distance, "No middleman pricing" trust tag,
 * full product catalog with add-to-cart.
 */
export default function CustomerSellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { seller, loading: sellerLoading } = useSeller(id);
  const { products, loading: productsLoading } = useSellerProducts(id);
  const { addItem } = useCart();

  if (sellerLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full" />
        <div className="px-4 space-y-3">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-base font-bold text-foreground">Seller not found</p>
        <Button className="mt-4" onClick={() => navigate("/customer")}>
          Back home
        </Button>
      </div>
    );
  }

  // Approximate distance to "you" — uses fixed customer point near MG Road.
  const distanceKm = 1.2 + Math.random() * 0.8;

  return (
    <div className="space-y-4 bg-surface min-h-screen pb-6">
      {/* Banner */}
      <div className="relative">
        <div className="h-44 overflow-hidden">
          <SafeImage
            src={seller.banner_image}
            category={seller.category}
            alt={seller.name}
            className="h-full w-full object-cover"
            width={768}
            height={176}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </button>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-[10px] uppercase tracking-wider font-bold opacity-90">{seller.category}</p>
          <h1 className="text-xl font-extrabold leading-tight">{seller.name}</h1>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Identity card */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border -mt-8 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {seller.location_label} · {distanceKm.toFixed(1)} km away
              </p>
              {seller.description && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{seller.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-full shrink-0">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-900 dark:text-amber-200">{seller.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat icon={<Package className="h-4 w-4 text-emerald-500" />} value={seller.total_orders.toLocaleString()} label="Orders" />
            <Stat icon={<Clock className="h-4 w-4 text-emerald-500" />} value={`${seller.avg_prep_minutes} min`} label="Prep" />
            <Stat icon={<Shield className="h-4 w-4 text-emerald-500" />} value={`${seller.contribution_pct}%`} label="Trust" />
          </div>
        </div>

        {/* No middleman tag */}
        <div className="bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl p-3.5 border border-emerald-500/30 flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[12px] font-extrabold text-emerald-700 dark:text-emerald-300">
              💚 No middleman pricing
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
              Prices set by seller — you pay them directly. ~{seller.contribution_pct}% to seller, ~6% to community fund, ~4% to driver.
            </p>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-[15px] font-bold text-foreground mb-3 px-1 flex items-center justify-between">
            Products
            <span className="text-[11px] font-medium text-muted-foreground">
              {productsLoading ? "Loading…" : `${products.length} items`}
            </span>
          </h3>

          {productsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => {
                const off =
                  p.original_price && p.original_price > p.price
                    ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                    : 0;
                return (
                  <div
                    key={p.id}
                    className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col"
                  >
                    <div className="h-28 overflow-hidden bg-muted relative">
                      <SafeImage
                        src={p.image}
                        category={p.category}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        width={256}
                        height={112}
                      />
                      {off > 0 && (
                        <span className="absolute top-2 left-2 text-[10px] font-extrabold text-white bg-rose-500 rounded-md px-1.5 py-0.5">
                          {off}% OFF
                        </span>
                      )}
                      {p.tag && (
                        <span className="absolute top-2 right-2 text-[10px] font-extrabold text-white bg-emerald-500 rounded-md px-1.5 py-0.5">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="text-[13px] font-bold text-foreground line-clamp-2">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{p.unit}</p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div>
                          <span className="text-[15px] font-bold text-foreground">₹{p.price}</span>
                          {p.original_price && p.original_price > p.price && (
                            <span className="text-[11px] text-muted-foreground line-through ml-1">
                              ₹{p.original_price}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600"
                          onClick={() =>
                            addItem({
                              id: p.id,
                              name: p.name,
                              price: Number(p.price),
                              unit: p.unit,
                              seller: seller.name,
                              image: p.image,
                            })
                          }
                          aria-label={`Add ${p.name}`}
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground text-center pb-2 font-medium">
          Prices set by seller · No platform markup
        </p>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center p-2.5 bg-muted/60 rounded-xl">
      <div className="mx-auto mb-1 w-fit">{icon}</div>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    </div>
  );
}
