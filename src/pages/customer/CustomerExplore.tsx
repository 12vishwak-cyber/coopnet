import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Shield, Truck, Search, SlidersHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sellers = [
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, contribution: 92, tags: ["Fast delivery", "Trusted seller"], items: 48, deliveryTime: "22 min", banner: "🏪" },
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, contribution: 97, tags: ["Organic", "Top rated"], items: 35, deliveryTime: "18 min", banner: "🌿" },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, contribution: 85, tags: ["Nearest"], items: 62, deliveryTime: "25 min", banner: "🛒" },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, contribution: 94, tags: ["Fresh daily", "Top rated"], items: 22, deliveryTime: "15 min", banner: "🥛" },
  { id: "s5", name: "Ahmed Provisions", distance: "2.1 km", rating: 4.4, contribution: 88, tags: ["Bulk orders"], items: 55, deliveryTime: "28 min", banner: "📦" },
];

const products = [
  { name: "Fresh Tomatoes", price: 20, unit: "1 kg", seller: "Priya Fresh Mart", image: "🍅" },
  { name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", image: "🥛" },
  { name: "Masala Chips", price: 10, unit: "Pack", seller: "Ravi General Store", image: "🍟" },
  { name: "Basmati Rice", price: 85, unit: "1 kg", seller: "Kumar Groceries", image: "🍚" },
  { name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", image: "🧀" },
  { name: "Cooking Oil", price: 180, unit: "1 L", seller: "Ravi General Store", image: "🫒" },
  { name: "Wheat Flour", price: 48, unit: "1 kg", seller: "Ahmed Provisions", image: "🌾" },
  { name: "Sugar", price: 45, unit: "1 kg", seller: "Kumar Groceries", image: "🍬" },
];

const localSpecials = [
  { name: "Organic Jaggery", price: 65, unit: "500g", seller: "Priya Fresh Mart", image: "🍯", badge: "Local Favorite" },
  { name: "Fresh Idli Batter", price: 40, unit: "1 L", seller: "Lakshmi Dairy", image: "🫓", badge: "Made Today" },
  { name: "Pickle (Mango)", price: 120, unit: "250g", seller: "Kumar Groceries", image: "🥭", badge: "Homemade" },
];

const filters = ["Fast delivery", "High trust", "Lowest price", "Nearest"];

export default function CustomerExplore() {
  const [tab, setTab] = useState<"sellers" | "products" | "specials">("sellers");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search sellers or products..." 
            className="pl-10 h-12 rounded-2xl bg-white border-gray-100 shadow-sm text-sm font-medium placeholder:text-gray-400"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {(["sellers", "products", "specials"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-sm py-2.5 rounded-xl transition-all font-semibold capitalize ${
                tab === t 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-400"
              }`}
            >
              {t === "specials" ? "Local Specials ⭐" : t}
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
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeFilter === f 
                ? "bg-emerald-500 text-white border-emerald-500" 
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {tab === "sellers" && (
        <div className="px-4 space-y-3 pb-4">
          {sellers.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Banner */}
              <div className="h-20 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center text-4xl">
                {s.banner}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{s.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs font-medium text-gray-600">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{s.rating}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500 flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />{s.distance}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{s.items} items</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Truck className="h-3 w-3" /> {s.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {s.tags.map((t) => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                      {t}
                    </span>
                  ))}
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5" /> {s.contribution}% score
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                <div className="h-20 rounded-xl bg-gray-50 flex items-center justify-center text-4xl mb-2.5">
                  {p.image}
                </div>
                <p className="text-[13px] font-bold text-gray-900 leading-snug">{p.name}</p>
                <p className="text-[11px] text-gray-400 mb-2">{p.unit} · {p.seller}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-gray-900">₹{p.price}</span>
                  <Button 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600"
                    onClick={(e) => { e.stopPropagation(); navigate("/customer/cart"); }}
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-4 font-medium">
            Prices set by sellers · No platform markup
          </p>
        </div>
      )}

      {tab === "specials" && (
        <div className="px-4 space-y-3 pb-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-sm font-bold text-gray-900">🌟 Local Specials</p>
            <p className="text-xs text-gray-500 mt-0.5">Unique products from your neighborhood sellers</p>
          </div>
          {localSpecials.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
                {p.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{p.badge}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{p.unit} · {p.seller}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[15px] font-bold text-gray-900">₹{p.price}</span>
                  <Button 
                    size="sm" 
                    className="h-8 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold"
                    onClick={() => navigate("/customer/cart")}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
