import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Plus, ChevronRight, Clock, Flame, TrendingUp, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

const promoBanners = [
  { title: "₹0 Delivery", subtitle: "On your first 3 orders", bg: "from-emerald-500 to-teal-500", emoji: "🚚" },
  { title: "Fresh Veggies under ₹20", subtitle: "Farm to door daily", bg: "from-orange-400 to-amber-500", emoji: "🥬" },
  { title: "Support Local Stores ❤️", subtitle: "Every order helps your community", bg: "from-rose-400 to-pink-500", emoji: "🏪" },
];

const categories = [
  { name: "Vegetables", emoji: "🥬", bg: "bg-green-50" },
  { name: "Fruits", emoji: "🍎", bg: "bg-red-50" },
  { name: "Dairy", emoji: "🥛", bg: "bg-blue-50" },
  { name: "Snacks", emoji: "🍪", bg: "bg-amber-50" },
  { name: "Essentials", emoji: "🧴", bg: "bg-purple-50" },
  { name: "Bakery", emoji: "🍞", bg: "bg-orange-50" },
  { name: "Beverages", emoji: "☕", bg: "bg-yellow-50" },
  { name: "Specials", emoji: "⭐", bg: "bg-emerald-50" },
];

const popularProducts = [
  { id: "p1", name: "Fresh Tomatoes", price: 20, unit: "1 kg", seller: "Priya Fresh Mart", image: "🍅", tag: "🔥 Hot" },
  { id: "p2", name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", image: "🥛", tag: "" },
  { id: "p3", name: "Masala Chips", price: 10, unit: "Pack", seller: "Ravi General Store", image: "🍟", tag: "⚡ Fast" },
  { id: "p4", name: "Basmati Rice", price: 85, unit: "1 kg", seller: "Kumar Groceries", image: "🍚", tag: "" },
  { id: "p5", name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", image: "🧀", tag: "🔥 Hot" },
  { id: "p6", name: "Cooking Oil", price: 180, unit: "1 L", seller: "Ravi General Store", image: "🫒", tag: "" },
  { id: "p7", name: "Bananas", price: 40, unit: "6 pcs", seller: "Priya Fresh Mart", image: "🍌", tag: "⚡ Fast" },
  { id: "p8", name: "Curd", price: 25, unit: "400g", seller: "Lakshmi Dairy", image: "🥣", tag: "" },
];

const featuredStores = [
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, deliveryTime: "18 min", image: "🌿", tag: "Organic" },
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, deliveryTime: "22 min", image: "🏪", tag: "Trusted" },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, deliveryTime: "15 min", image: "🥛", tag: "Fresh Daily" },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, deliveryTime: "25 min", image: "🛒", tag: "Nearest" },
];

const smartPicks = [
  { name: "Organic Jaggery", price: 65, unit: "500g", seller: "Priya Fresh Mart", image: "🍯", reason: "High trust seller" },
  { name: "Fresh Idli Batter", price: 40, unit: "1 L", seller: "Lakshmi Dairy", image: "🫓", reason: "Made today" },
  { name: "Pickle (Mango)", price: 120, unit: "250g", seller: "Kumar Groceries", image: "🥭", reason: "Community favorite" },
];

export default function CustomerHome() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);

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
              <div className={`h-14 w-14 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl shadow-sm`}>
                {cat.emoji}
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
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col group">
              <div className="relative h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl">
                {p.tag && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                    {p.tag}
                  </span>
                )}
                {p.image}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-[13px] font-bold text-gray-900 leading-snug">{p.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.unit} · {p.seller}</p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-base font-extrabold text-gray-900">₹{p.price}</span>
                  <Button
                    size="sm"
                    className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-sm text-xs font-bold active:scale-95 transition-transform"
                    onClick={(e) => { e.stopPropagation(); }}
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
              <div className="h-20 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-4xl">
                {s.image}
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

      {/* Smart Picks - Community */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h2 className="text-base font-extrabold text-gray-900">Community Picks</h2>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {smartPicks.map((p) => (
            <div key={p.name} className="min-w-[200px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                  {p.image}
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
                <Button size="sm" className="h-7 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-[11px] font-bold">
                  <Plus className="h-3 w-3 mr-0.5" /> ADD
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooperative CTA - Subtle */}
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
