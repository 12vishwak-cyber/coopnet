import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Star, Clock, ShieldCheck, Leaf, Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getProductById, discountPct } from "@/data/products";
import SafeImage from "@/components/SafeImage";

// Categories that benefit from a multi-image gallery (non-consumables).
const GALLERY_CATEGORIES = new Set(["Fashion", "Electronics", "Home", "Personal Care"]);

export default function CustomerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem, decrementItem } = useCart();
  const product = getProductById(id || "");
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-surface">
        <p className="text-base font-bold text-foreground">Product not found</p>
        <Button onClick={() => navigate("/customer")} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
          Back to home
        </Button>
      </div>
    );
  }

  const inCart = items.find((i) => i.id === product.id);
  const qty = inCart?.quantity ?? 0;
  const pct = discountPct(product);
  const showGallery = GALLERY_CATEGORIES.has(product.category) && (product.gallery?.length ?? 0) > 1;
  const images = showGallery ? product.gallery! : [product.image];

  // Fair distribution breakdown
  const sellerEarnings = Math.round(product.price * 0.78);
  const workerEarnings = Math.round(product.price * 0.12);
  const cooperativeFund = Math.round(product.price * 0.06);
  const systemCost = product.price - sellerEarnings - workerEarnings - cooperativeFund;

  const handleAdd = () =>
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      seller: product.seller,
      image: product.image,
    });

  return (
    <div className="min-h-screen bg-surface text-foreground pb-32">
      {/* Hero image / carousel */}
      <div className="relative bg-card">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 h-9 w-9 rounded-full bg-card/90 backdrop-blur shadow-md flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <button
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-card/90 backdrop-blur shadow-md flex items-center justify-center"
          aria-label="Save"
        >
          <Heart className="h-4 w-4 text-foreground" />
        </button>
        {pct > 0 && (
          <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
            {pct}% OFF
          </span>
        )}
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <SafeImage
            src={images[activeImg]}
            category={product.category}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {showGallery && (
          <>
            <button
              onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/90 backdrop-blur shadow-md flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => setActiveImg((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/90 backdrop-blur shadow-md flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-card border-b border-border">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-14 w-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    i === activeImg ? "border-emerald-500" : "border-transparent opacity-60"
                  }`}
                >
                  <SafeImage src={src} category={product.category} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Title & price */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{product.unit}</p>
          <h1 className="text-xl font-extrabold text-foreground mt-1 leading-tight">{product.name}</h1>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-2xl font-extrabold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through mb-0.5">₹{product.originalPrice}</span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-0.5">({pct}% off)</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[11px] font-medium">
            <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" /> 10–15 min
            </span>
            <span className="flex items-center gap-1 bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" /> Quality assured
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed">{product.description}</p>
        </div>

        {/* Seller */}
        <button
          onClick={() => navigate(`/customer/seller/${product.sellerId}`)}
          className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="h-11 w-11 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">{product.seller[0]}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{product.seller}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-foreground">4.7</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[11px] text-muted-foreground">View store</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Fair distribution */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-extrabold text-foreground">Where Your ₹{product.price} Goes</h2>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Seller", amount: sellerEarnings, pct: 78, color: "bg-emerald-500" },
              { label: "Worker", amount: workerEarnings, pct: 12, color: "bg-amber-500" },
              { label: "Community Fund", amount: cooperativeFund, pct: 6, color: "bg-blue-500" },
              { label: "System Cost", amount: systemCost, pct: 4, color: "bg-muted-foreground/40" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-medium text-muted-foreground">{row.label}</span>
                  <span className="font-bold text-foreground">₹{row.amount}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 mt-3">
            <strong>Transparent pricing.</strong> No hidden markup — sellers set their price.
          </p>
        </div>
      </div>

      {/* Sticky bottom bar — sits above the customer bottom nav (68px) */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 bg-card border-t border-border px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {qty === 0 ? (
          <Button
            onClick={handleAdd}
            className="w-full h-13 py-3.5 rounded-2xl text-[15px] font-extrabold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white"
          >
            Add to Cart · ₹{product.price}
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-emerald-500/15 rounded-2xl px-2 py-2 border border-emerald-500/30">
              <button
                onClick={() => decrementItem(product.id)}
                className="h-9 w-9 rounded-xl bg-card shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 active:scale-95 transition-transform"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 w-6 text-center">{qty}</span>
              <button
                onClick={handleAdd}
                className="h-9 w-9 rounded-xl bg-emerald-500 text-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={() => navigate("/customer/cart")}
              className="flex-1 h-13 py-3.5 rounded-2xl text-[15px] font-extrabold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white"
            >
              View Cart · ₹{qty * product.price}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

