import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Search, SlidersHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

import imgTomatoes from "@/assets/products/tomatoes.jpg";
import imgMilk from "@/assets/products/milk.jpg";
import imgChips from "@/assets/products/chips.jpg";
import imgRice from "@/assets/products/rice.jpg";
import imgPaneer from "@/assets/products/paneer.jpg";
import imgCookingOil from "@/assets/products/cooking-oil.jpg";
import imgWheatFlour from "@/assets/products/wheat-flour.jpg";
import imgSugar from "@/assets/products/sugar.jpg";
import imgJaggery from "@/assets/products/jaggery.jpg";
import imgIdliBatter from "@/assets/products/idli-batter.jpg";
import imgPickle from "@/assets/products/pickle.jpg";

import storeGeneral from "@/assets/stores/general-store.jpg";
import storeFreshMart from "@/assets/stores/fresh-mart.jpg";
import storeGroceries from "@/assets/stores/groceries.jpg";
import storeDairy from "@/assets/stores/dairy.jpg";
import storeProvisions from "@/assets/stores/provisions.jpg";

const sellers = [
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, tags: ["Fast delivery", "Trusted"], items: 48, deliveryTime: "22 min", banner: storeGeneral },
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, tags: ["Organic", "Top rated"], items: 35, deliveryTime: "18 min", banner: storeFreshMart },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, tags: ["Nearest"], items: 62, deliveryTime: "25 min", banner: storeGroceries },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, tags: ["Fresh daily"], items: 22, deliveryTime: "15 min", banner: storeDairy },
  { id: "s5", name: "Ahmed Provisions", distance: "2.1 km", rating: 4.4, tags: ["Bulk orders"], items: 55, deliveryTime: "28 min", banner: storeProvisions },
];

const products = [
  { name: "Fresh Tomatoes", price: 20, unit: "1 kg", seller: "Priya Fresh Mart", image: imgTomatoes, tag: "🔥" },
  { name: "Whole Milk", price: 30, unit: "500 ml", seller: "Lakshmi Dairy", image: imgMilk, tag: "" },
  { name: "Masala Chips", price: 10, unit: "Pack", seller: "Ravi General Store", image: imgChips, tag: "⚡" },
  { name: "Basmati Rice", price: 85, unit: "1 kg", seller: "Kumar Groceries", image: imgRice, tag: "" },
  { name: "Fresh Paneer", price: 90, unit: "200g", seller: "Lakshmi Dairy", image: imgPaneer, tag: "🔥" },
  { name: "Cooking Oil", price: 180, unit: "1 L", seller: "Ravi General Store", image: imgCookingOil, tag: "" },
  { name: "Wheat Flour", price: 48, unit: "1 kg", seller: "Ahmed Provisions", image: imgWheatFlour, tag: "" },
  { name: "Sugar", price: 45, unit: "1 kg", seller: "Kumar Groceries", image: imgSugar, tag: "" },
];

const localSpecials = [
  { name: "Organic Jaggery", price: 65, unit: "500g", seller: "Priya Fresh Mart", image: imgJaggery, badge: "Local Favorite" },
  { name: "Fresh Idli Batter", price: 40, unit: "1 L", seller: "Lakshmi Dairy", image: imgIdliBatter, badge: "Made Today" },
  { name: "Pickle (Mango)", price: 120, unit: "250g", seller: "Kumar Groceries", image: imgPickle, badge: "Homemade" },
];

const filters = ["Fast delivery", "Lowest price", "High trust", "Nearest"];

export default function CustomerExplore() {
  const [tab, setTab] = useState<"products" | "sellers" | "specials">("products");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products, stores..."
            className="pl-10 pr-12 h-12 rounded-2xl bg-white border-gray-100 shadow-sm text-sm font-medium placeholder:text-gray-400"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
          {(["products", "sellers", "specials"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-sm py-2.5 rounded-xl transition-all font-semibold capitalize ${
                tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
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
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
                <div className="relative h-28 overflow-hidden">
                  {p.tag && (
                    <span className="absolute top-2 left-2 z-10 text-[9px] font-bold bg-white/90 px-1.5 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  )}
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={256} height={160} />
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-bold text-gray-900 leading-snug">{p.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.unit} · {p.seller}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-extrabold text-gray-900">₹{p.price}</span>
                    <Button
                      size="sm"
                      onClick={() => addItem({ id: `prod-${p.name}`, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image })}
                      className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold active:scale-95 transition-transform"
                    >
                      <Plus className="h-3.5 w-3.5 mr-0.5" /> ADD
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-4 font-medium">
            Prices set by sellers · No platform markup
          </p>
        </div>
      )}

      {tab === "sellers" && (
        <div className="px-4 space-y-3 pb-4">
          {sellers.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 active:scale-[0.98] transition-transform"
            >
              <div className="h-28 overflow-hidden">
                <img src={s.banner} alt={s.name} className="h-full w-full object-cover" loading="lazy" width={400} height={112} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{s.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700">
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
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {s.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {s.tags.map((t) => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
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
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-sm font-bold text-gray-900">🌟 Local Specials</p>
            <p className="text-xs text-gray-500 mt-0.5">Unique products from your neighborhood</p>
          </div>
          {localSpecials.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={64} height={64} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{p.badge}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{p.unit} · {p.seller}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-extrabold text-gray-900">₹{p.price}</span>
                  <Button
                    size="sm"
                    onClick={() => addItem({ id: `spec-${p.name}`, name: p.name, price: p.price, unit: p.unit, seller: p.seller, image: p.image })}
                    className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold active:scale-95 transition-transform"
                  >
                    <Plus className="h-3 w-3 mr-0.5" /> ADD
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
