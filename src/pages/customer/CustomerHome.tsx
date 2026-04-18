import { useNavigate } from "react-router-dom";
import { Search, Star, Plus, ChevronRight, Clock, Flame, TrendingUp, Heart } from "lucide-react";
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

const popularProducts = [
  { id: "p1", name: "Fresh Tomatoes", price: 20, unit: "1 kg", seller: "Priya Fresh Mart", image: imgTomatoes, tag: "🔥 Hot" },
  { id: "p2", name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", image: imgMilk, tag: "" },
  { id: "p3", name: "Masala Chips", price: 10, unit: "Pack", seller: "Ravi General Store", image: imgChips, tag: "⚡ Fast" },
  { id: "p4", name: "Basmati Rice", price: 85, unit: "1 kg", seller: "Kumar Groceries", image: imgRice, tag: "" },
  { id: "p5", name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", image: imgPaneer, tag: "🔥 Hot" },
  { id: "p6", name: "Cooking Oil", price: 180, unit: "1 L", seller: "Ravi General Store", image: imgCookingOil, tag: "" },
  { id: "p7", name: "Bananas", price: 40, unit: "6 pcs", seller: "Priya Fresh Mart", image: imgBananas, tag: "⚡ Fast" },
  { id: "p8", name: "Curd", price: 25, unit: "400g", seller: "Lakshmi Dairy", image: imgCurd, tag: "" },
];

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
            <button key={cat.name} className="flex flex-col items-center gap-1.5 min-w-[60px] active:scale-95 transition-transform">
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
          {popularProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col">
              <div className="relative h-28 overflow-hidden">
                {p.tag && (
                  <span className="absolute top-2 left-2 z-10 text-[9px] font-bold bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                    {p.tag}
                  </span>
                )}
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={256} height={160} />
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-[13px] font-bold text-gray-900 leading-snug">{p.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.unit} · {p.seller}</p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-base font-extrabold text-gray-900">₹{p.price}</span>
                  <Button
                    size="sm"
                    onClick={() => addItem({ id: p.id, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image })}
                    className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-sm text-xs font-bold active:scale-95 transition-transform"
                  >
                    <Plus className="h-3.5 w-3.5 mr-0.5" /> ADD
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
