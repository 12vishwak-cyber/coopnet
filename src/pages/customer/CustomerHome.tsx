import { useNavigate } from "react-router-dom";
import { Search, Star, Plus, ChevronRight, Clock, Flame, TrendingUp, Heart, Tag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

// Product images
import imgTomatoes from "@/assets/products/tomatoes.jpg";
import imgMilk from "@/assets/products/milk.jpg";
import imgChips from "@/assets/products/chips.jpg";
import imgRice from "@/assets/products/rice.jpg";
import imgPaneer from "@/assets/products/paneer.jpg";
import imgCookingOil from "@/assets/products/cooking-oil.jpg";
import imgBananas from "@/assets/products/bananas.jpg";
import imgCurd from "@/assets/products/curd.jpg";

// Category images
import catVegetables from "@/assets/categories/vegetables.jpg";
import catFruits from "@/assets/categories/fruits.jpg";
import catDairy from "@/assets/categories/dairy.jpg";
import catSnacks from "@/assets/categories/snacks.jpg";
import catEssentials from "@/assets/categories/essentials.jpg";
import catBakery from "@/assets/categories/bakery.jpg";
import catBeverages from "@/assets/categories/beverages.jpg";
import catSpecials from "@/assets/categories/specials.jpg";

// Store images
import storeFreshMart from "@/assets/stores/fresh-mart.jpg";
import storeGeneral from "@/assets/stores/general-store.jpg";
import storeDairy from "@/assets/stores/dairy.jpg";
import storeGroceries from "@/assets/stores/groceries.jpg";

// Specials product images
import imgJaggery from "@/assets/products/jaggery.jpg";
import imgIdliBatter from "@/assets/products/idli-batter.jpg";
import imgPickle from "@/assets/products/pickle.jpg";

const promoBanners = [
  { title: "₹0 Delivery", subtitle: "On your first 3 orders", bg: "from-emerald-500 to-teal-500", emoji: "🚚" },
  { title: "Fresh Veggies under ₹20", subtitle: "Farm to door daily", bg: "from-orange-400 to-amber-500", emoji: "🥬" },
  { title: "Support Local Stores ❤️", subtitle: "Every order helps your community", bg: "from-rose-400 to-pink-500", emoji: "🏪" },
];

const categories = [
  { name: "Vegetables", image: catVegetables },
  { name: "Fruits", image: catFruits },
  { name: "Dairy", image: catDairy },
  { name: "Snacks", image: catSnacks },
  { name: "Essentials", image: catEssentials },
  { name: "Bakery", image: catBakery },
  { name: "Beverages", image: catBeverages },
  { name: "Specials", image: catSpecials },
];

import { PRODUCTS, discountPct } from "@/data/products";

const popularProducts = PRODUCTS.slice(0, 8);
// Static "selling fast" hints for urgency on a couple of trending cards
const urgencyById: Record<string, string> = {
  p1: "Selling fast 🔥",
  p5: "Only 4 left",
};
// "Recommended for you" — different slice for behavioral depth
const recommended = [...PRODUCTS].slice(8, 13).concat(PRODUCTS.slice(0, 1));

const featuredStores = [
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, deliveryTime: "18 min", image: storeFreshMart, tag: "Organic" },
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, deliveryTime: "22 min", image: storeGeneral, tag: "Trusted" },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, deliveryTime: "15 min", image: storeDairy, tag: "Fresh Daily" },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, deliveryTime: "25 min", image: storeGroceries, tag: "Nearest" },
];

const smartPicks = [
  { name: "Organic Jaggery", price: 65, unit: "500g", seller: "Priya Fresh Mart", image: imgJaggery, reason: "High trust seller" },
  { name: "Fresh Idli Batter", price: 40, unit: "1 L", seller: "Lakshmi Dairy", image: imgIdliBatter, reason: "Made today" },
  { name: "Pickle (Mango)", price: 120, unit: "250g", seller: "Kumar Groceries", image: imgPickle, reason: "Community favorite" },
];

const buyAgain = [
  { id: "ba1", name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", image: imgMilk },
  { id: "ba2", name: "Bananas", price: 40, unit: "6 pcs", seller: "Priya Fresh Mart", image: imgBananas },
  { id: "ba3", name: "Curd", price: 25, unit: "400g", seller: "Lakshmi Dairy", image: imgCurd },
  { id: "ba4", name: "Masala Chips", price: 10, unit: "Pack", seller: "Ravi General Store", image: imgChips },
];

const trending = [
  { id: "tr1", name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", image: imgPaneer, badge: "🔥 Hot" },
  { id: "tr2", name: "Basmati Rice", price: 85, unit: "1 kg", seller: "Kumar Groceries", image: imgRice, badge: "🔥 Hot" },
  { id: "tr3", name: "Cooking Oil", price: 180, unit: "1 L", seller: "Ravi General Store", image: imgCookingOil, badge: "⚡ Fast" },
  { id: "tr4", name: "Fresh Tomatoes", price: 20, unit: "1 kg", seller: "Priya Fresh Mart", image: imgTomatoes, badge: "🔥 Hot" },
];

export default function CustomerHome() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <div className="space-y-5 pb-6">
      {/* Search Bar */}
      <div className="px-4 pt-3">
        <button
          onClick={() => navigate("/customer/explore")}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
        >
          <Search className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Search for milk, fruits, snacks...</span>
        </button>
      </div>

      {/* Promo code banner */}
      <div className="px-4">
        <button
          onClick={() => navigate("/customer/cart")}
          className="w-full flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-3.5 py-2.5 active:scale-[0.99] transition-transform"
        >
          <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Tag className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-extrabold text-amber-900 leading-tight">
              Use <span className="font-mono">WELCOME10</span> for 10% off
            </p>
            <p className="text-[10px] text-amber-700">Or try FREEDEL · SAVE50 at checkout</p>
          </div>
          <ChevronRight className="h-4 w-4 text-amber-600" />
        </button>
      </div>

      {/* Promo Banners */}
      <div className="px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {promoBanners.map((b, i) => (
            <div
              key={i}
              className={`min-w-[280px] snap-center bg-gradient-to-r ${b.bg} rounded-2xl p-5 text-white flex items-center justify-between shadow-lg`}
            >
              <div>
                <p className="text-lg font-extrabold leading-tight">{b.title}</p>
                <p className="text-xs font-medium opacity-90 mt-1">{b.subtitle}</p>
                <button className="mt-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Shop Now →
                </button>
              </div>
              <span className="text-5xl ml-2">{b.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4">
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/customer/explore?category=${encodeURIComponent(cat.name)}`)}
              className="flex flex-col items-center gap-1.5 min-w-[60px] active:scale-95 transition-transform"
            >
              <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-sm">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" loading="lazy" width={56} height={56} />
              </div>
              <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <h2 className="text-base font-extrabold text-gray-900">Popular Right Now</h2>
          </div>
          <button className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popularProducts.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-28 overflow-hidden">
                  {pct > 0 && (
                    <span className="absolute top-2 left-2 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                      {pct}% OFF
                    </span>
                  )}
                  {pct === 0 && p.tag && (
                    <span className="absolute top-2 left-2 z-10 text-[9px] font-bold bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                      {p.tag}
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={256} height={160} />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-[13px] font-bold text-gray-900 leading-snug">{p.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.unit} · {p.seller}</p>
                  {urgencyById[p.id] && (
                    <p className="text-[10px] font-extrabold text-rose-500 mt-0.5">{urgencyById[p.id]}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-gray-900">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image });
                      }}
                      className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-sm text-xs font-bold active:scale-95 transition-transform"
                    >
                      <Plus className="h-3.5 w-3.5 mr-0.5" /> ADD
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buy Again */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          <h2 className="text-base font-extrabold text-gray-900">Buy Again</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {buyAgain.map((p) => (
            <div key={p.id} className="min-w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col">
              <div className="h-24 overflow-hidden">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={140} height={96} />
              </div>
              <div className="p-2.5 flex flex-col flex-1">
                <p className="text-[12px] font-bold text-gray-900 leading-snug truncate">{p.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.unit}</p>
                <div className="flex items-center justify-between mt-auto pt-1.5">
                  <span className="text-sm font-extrabold text-gray-900">₹{p.price}</span>
                  <Button
                    size="sm"
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image })}
                    className="h-7 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[11px] font-bold active:scale-95 transition-transform"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-orange-500" />
          <h2 className="text-base font-extrabold text-gray-900">Trending in your area</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {trending.map((p) => (
            <div key={p.id} className="min-w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col">
              <div className="relative h-24 overflow-hidden">
                <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-bold bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                  {p.badge}
                </span>
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={140} height={96} />
              </div>
              <div className="p-2.5 flex flex-col flex-1">
                <p className="text-[12px] font-bold text-gray-900 leading-snug truncate">{p.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.unit}</p>
                <div className="flex items-center justify-between mt-auto pt-1.5">
                  <span className="text-sm font-extrabold text-gray-900">₹{p.price}</span>
                  <Button
                    size="sm"
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image })}
                    className="h-7 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[11px] font-bold active:scale-95 transition-transform"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
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
          <h2 className="text-base font-extrabold text-gray-900">Recommended for you</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recommended.map((p) => {
            const pct = discountPct(p);
            return (
              <div
                key={`rec-${p.id}`}
                onClick={() => navigate(`/customer/product/${p.id}`)}
                className="min-w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-24 overflow-hidden">
                  {pct > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold bg-rose-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                      {pct}% OFF
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={140} height={96} />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="text-[12px] font-bold text-gray-900 leading-snug truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.unit}</p>
                  <div className="flex items-center justify-between mt-auto pt-1.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-gray-900">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[9px] text-gray-400 line-through">₹{p.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image });
                      }}
                      className="h-7 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[11px] font-bold active:scale-95 transition-transform"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
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
          <h2 className="text-base font-extrabold text-gray-900">Local Stores Near You</h2>
          <button onClick={() => navigate("/customer/explore")} className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {featuredStores.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="min-w-[180px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 text-left active:scale-[0.98] transition-transform"
            >
              <div className="h-24 overflow-hidden">
                <img src={s.image} alt={s.name} className="h-full w-full object-cover" loading="lazy" width={180} height={96} />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-700">{s.rating}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[11px] text-gray-500">{s.distance}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> {s.deliveryTime}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{s.tag}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Picks */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <h2 className="text-base font-extrabold text-gray-900">Community Picks</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {smartPicks.map((p) => (
            <div key={p.name} className="min-w-[200px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl overflow-hidden shadow-sm">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={48} height={48} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.unit} · {p.seller}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-gray-900">₹{p.price}</span>
                  <p className="text-[9px] font-medium text-emerald-600 mt-0.5">✨ {p.reason}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addItem({ id: `pick-${p.name}`, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image })}
                  className="h-7 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[11px] font-bold"
                >
                  <Plus className="h-3 w-3 mr-0.5" /> ADD
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooperative CTA */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-md">
            <Heart className="h-5 w-5 text-white fill-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-gray-900">Your orders make a difference</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Supports <strong>3 local sellers</strong> · ₹12 to workers · ₹4 to community
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
        </div>
      </div>
    </div>
  );
}
