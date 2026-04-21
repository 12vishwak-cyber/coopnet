import { useNavigate, useParams } from "react-router-dom";
import { Star, MapPin, ArrowLeft, Clock, Package, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import storeGeneral from "@/assets/stores/general-store.jpg";
import storeFreshMart from "@/assets/stores/fresh-mart.jpg";
import storeGroceries from "@/assets/stores/groceries.jpg";
import storeDairy from "@/assets/stores/dairy.jpg";
import storeProvisions from "@/assets/stores/provisions.jpg";

import imgRice from "@/assets/products/rice.jpg";
import imgWheatFlour from "@/assets/products/wheat-flour.jpg";
import imgCookingOil from "@/assets/products/cooking-oil.jpg";
import imgSugar from "@/assets/products/sugar.jpg";
import imgMilk from "@/assets/products/milk.jpg";
import imgPaneer from "@/assets/products/paneer.jpg";

const sellerData: Record<string, { name: string; location: string; rating: number; orders: number; avgTime: string; contribution: number; description: string; banner: string }> = {
  s1: { name: "Ravi General Store", location: "MG Road, Block A", rating: 4.6, orders: 1240, avgTime: "22 min", contribution: 92, description: "Family-run general store serving the neighborhood for 15 years. Member of CoopNet since 2023.", banner: storeGeneral },
  s2: { name: "Priya Fresh Mart", location: "Sector 12, Market Street", rating: 4.8, orders: 890, avgTime: "18 min", contribution: 97, description: "Organic and fresh produce specialist. Top contributor to the cooperative fund.", banner: storeFreshMart },
  s3: { name: "Kumar Groceries", location: "Main Bazaar, Shop 14", rating: 4.3, orders: 2100, avgTime: "25 min", contribution: 85, description: "Wholesale and retail grocery store. Longest-running member in the network.", banner: storeGroceries },
  s4: { name: "Lakshmi Dairy", location: "Dairy Colony, Lane 3", rating: 4.7, orders: 560, avgTime: "15 min", contribution: 94, description: "Fresh dairy products delivered daily. All products sourced from local farms.", banner: storeDairy },
  s5: { name: "Ahmed Provisions", location: "Old Town, Circle Road", rating: 4.4, orders: 1580, avgTime: "28 min", contribution: 88, description: "Large inventory provisions store. Known for bulk order handling.", banner: storeProvisions },
};

const products = [
  { name: "Rice (5kg)", price: 280, image: imgRice },
  { name: "Wheat Flour (2kg)", price: 95, image: imgWheatFlour },
  { name: "Cooking Oil (1L)", price: 180, image: imgCookingOil },
  { name: "Sugar (1kg)", price: 45, image: imgSugar },
  { name: "Whole Milk (1L)", price: 56, image: imgMilk },
  { name: "Fresh Paneer", price: 90, image: imgPaneer },
];

export default function CustomerSellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const seller = sellerData[id || "s1"] || sellerData.s1;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="relative">
        <div className="h-44 overflow-hidden">
          <img src={seller.banner} alt={seller.name} className="h-full w-full object-cover" width={768} height={176} />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Seller Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 -mt-8 relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{seller.name}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />{seller.location}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-900">{seller.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">{seller.description}</p>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2.5 bg-gray-50 rounded-xl">
              <Package className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
              <p className="text-sm font-bold text-gray-900">{seller.orders.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 font-medium">Orders</p>
            </div>
            <div className="text-center p-2.5 bg-gray-50 rounded-xl">
              <Clock className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
              <p className="text-sm font-bold text-gray-900">{seller.avgTime}</p>
              <p className="text-[10px] text-gray-400 font-medium">Delivery</p>
            </div>
            <div className="text-center p-2.5 bg-gray-50 rounded-xl">
              <Shield className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
              <p className="text-sm font-bold text-gray-900">{seller.contribution}%</p>
              <p className="text-[10px] text-gray-400 font-medium">Trust Score</p>
            </div>
          </div>
        </div>

        {/* Fair Distribution */}
        <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-100">
          <p className="text-[11px] font-bold text-emerald-800 mb-1">💚 Fair Distribution</p>
          <p className="text-[11px] text-emerald-700">
            78% to seller · 12% to delivery driver · 6% to community fund
          </p>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-3">Products</h3>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-24 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" width={256} height={96} />
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-bold text-gray-900">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[15px] font-bold text-gray-900">₹{p.price}</span>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => navigate("/customer/cart")}
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-gray-400 text-center pb-4 font-medium">
          Prices set by seller · No platform markup
        </p>
      </div>
    </div>
  );
}
