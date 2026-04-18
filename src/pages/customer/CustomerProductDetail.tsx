import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Star, Clock, ShieldCheck, Leaf, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getProductById, discountPct } from "@/data/products";

export default function CustomerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addItem, decrementItem } = useCart();
  const product = getProductById(id || "");

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-base font-bold text-gray-900">Product not found</p>
        <Button onClick={() => navigate("/customer")} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
          Back to home
        </Button>
      </div>
    );
  }

  const inCart = items.find((i) => i.id === product.id);
  const qty = inCart?.quantity ?? 0;
  const pct = discountPct(product);

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
    <div className="min-h-screen bg-[#f8f8f8] pb-32">
      {/* Hero image */}
      <div className="relative bg-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </button>
        <button
          className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center"
          aria-label="Save"
        >
          <Heart className="h-4 w-4 text-gray-700" />
        </button>
        {pct > 0 && (
          <span className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
            {pct}% OFF
          </span>
        )}
        <div className="aspect-square w-full overflow-hidden">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Title & price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">{product.unit}</p>
          <h1 className="text-xl font-extrabold text-gray-900 mt-1 leading-tight">{product.name}</h1>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-2xl font-extrabold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through mb-0.5">₹{product.originalPrice}</span>
                <span className="text-xs font-bold text-rose-600 mb-0.5">({pct}% off)</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[11px] font-medium text-gray-500">
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" /> 10–15 min
            </span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" /> Quality assured
            </span>
          </div>
          <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">{product.description}</p>
        </div>

        {/* Seller */}
        <button
          onClick={() => navigate(`/customer/seller/${product.sellerId}`)}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
            <span className="text-base font-extrabold text-emerald-700">{product.seller[0]}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{product.seller}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-gray-700">4.7</span>
              <span className="text-gray-300">·</span>
              <span className="text-[11px] text-gray-500">View store</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Fair distribution */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-extrabold text-gray-900">Where Your ₹{product.price} Goes</h2>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Seller", amount: sellerEarnings, pct: 78, color: "bg-emerald-500" },
              { label: "Worker", amount: workerEarnings, pct: 12, color: "bg-amber-500" },
              { label: "Community Fund", amount: cooperativeFund, pct: 6, color: "bg-blue-500" },
              { label: "System Cost", amount: systemCost, pct: 4, color: "bg-gray-300" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-medium text-gray-600">{row.label}</span>
                  <span className="font-bold text-gray-900">₹{row.amount}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mt-3">
            <strong>Transparent pricing.</strong> No hidden markup — sellers set their price.
          </p>
        </div>
      </div>

      {/* Sticky Add to cart */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {qty === 0 ? (
          <Button
            onClick={handleAdd}
            className="w-full h-13 py-3.5 rounded-2xl text-[15px] font-extrabold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200"
          >
            <Plus className="h-4 w-4 mr-1" /> Add to Cart · ₹{product.price}
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl px-2 py-2 border border-emerald-100">
              <button
                onClick={() => decrementItem(product.id)}
                className="h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 active:scale-95 transition-transform"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base font-extrabold text-emerald-700 w-6 text-center">{qty}</span>
              <button
                onClick={handleAdd}
                className="h-9 w-9 rounded-xl bg-emerald-500 text-white shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={() => navigate("/customer/cart")}
              className="flex-1 h-13 py-3.5 rounded-2xl text-[15px] font-extrabold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200"
            >
              View Cart · ₹{qty * product.price}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
