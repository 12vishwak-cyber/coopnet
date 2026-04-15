import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Shield, Plus, ChevronRight, Leaf, TrendingUp, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Vegetables", emoji: "🥬" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Snacks", emoji: "🍪" },
  { name: "Local Specials", emoji: "🏪" },
  { name: "Essentials", emoji: "🧴" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Beverages", emoji: "☕" },
  { name: "Bakery", emoji: "🍞" },
];

const featuredSellers = [
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, contribution: 97, tags: ["Organic", "Trusted"], deliveryTime: "18 min", image: "🌿" },
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, contribution: 92, tags: ["Fast delivery"], deliveryTime: "22 min", image: "🏪" },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, contribution: 94, tags: ["Fresh daily"], deliveryTime: "15 min", image: "🥛" },
];

const products = [
  { name: "Fresh Tomatoes", price: 20, unit: "1 kg", seller: "Priya Fresh Mart", image: "🍅" },
  { name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", image: "🥛" },
  { name: "Masala Chips", price: 10, unit: "Pack", seller: "Ravi General Store", image: "🍟" },
  { name: "Basmati Rice", price: 85, unit: "1 kg", seller: "Kumar Groceries", image: "🍚" },
  { name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", image: "🧀" },
  { name: "Cooking Oil", price: 180, unit: "1 L", seller: "Ravi General Store", image: "🫒" },
];

export default function CustomerHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="px-4 pt-3">
        <button 
          onClick={() => navigate("/customer/explore")}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 text-left"
        >
          <Search className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-400 font-medium">Search for groceries, snacks, essentials...</span>
        </button>
      </div>

      {/* Categories */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">Shop by Category</h2>
          <button className="text-xs font-semibold text-emerald-600">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat.name} className="flex flex-col items-center gap-1.5 min-w-[68px]">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl hover:scale-105 transition-transform">
                {cat.emoji}
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Sellers */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">Featured Sellers</h2>
          <button onClick={() => navigate("/customer/explore")} className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {featuredSellers.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="min-w-[220px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
                  {s.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-600 font-medium">{s.rating}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{s.distance}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Truck className="h-2.5 w-2.5" /> {s.deliveryTime}
                </span>
                {s.tags.map(t => (
                  <span key={t} className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-2.5">
                <Shield className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-medium text-emerald-600">{s.contribution}% network score</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Feed */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">Quick Add</h2>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Popular now
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col">
              <div className="h-20 rounded-xl bg-gray-50 flex items-center justify-center text-4xl mb-2.5">
                {p.image}
              </div>
              <p className="text-[13px] font-bold text-gray-900 leading-snug">{p.name}</p>
              <p className="text-[11px] text-gray-400 mb-2">{p.unit} · {p.seller}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[15px] font-bold text-gray-900">₹{p.price}</span>
                <Button 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                  onClick={() => navigate("/customer/cart")}
                >
                  <Plus className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooperative Insight - Subtle */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Leaf className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">Your purchases make a difference</p>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                🌱 Supports <strong>3 local sellers</strong> in your area<br />
                💰 ₹12 goes to workers · ₹4 to community fund
              </p>
              <button className="text-[11px] font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                Learn how it works <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
