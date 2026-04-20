import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, Users, PiggyBank, Truck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CustomerPostOrder() {
  const navigate = useNavigate();
  const [sellerRating, setSellerRating] = useState(4);
  const [workerRating, setWorkerRating] = useState(5);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-[15px] font-bold text-gray-900">Order Complete</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Success */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Order Delivered!</h1>
          <p className="text-xs text-gray-400 mt-1">ORD-1847 · Here's your impact</p>
        </div>

        {/* Impact Cards */}
        {[
          { icon: PiggyBank, color: "bg-emerald-50", iconColor: "text-emerald-500", title: "₹34 contributed to community fund", desc: "Supports routing, infrastructure, and shared intelligence" },
          { icon: Users, color: "bg-blue-50", iconColor: "text-blue-500", title: "Supported a local seller", desc: "Kumar Groceries received ₹445 directly — no commission" },
          { icon: Truck, color: "bg-amber-50", iconColor: "text-amber-500", title: "Fair worker earnings", desc: "Arun K. earned ₹68 — based on cooperative rules" },
        ].map(({ icon: Icon, color, iconColor, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}

        {/* Ratings */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Rate Your Experience</h3>
          {[
            { label: "Seller", rating: sellerRating, setRating: setSellerRating },
            { label: "Worker", rating: workerRating, setRating: setWorkerRating },
          ].map(({ label, rating, setRating }) => (
            <div key={label} className="flex items-center justify-between mb-3 last:mb-0">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)}>
                    <Star className={`h-6 w-6 transition-colors ${n <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Membership CTA */}
        <button
          onClick={() => navigate("/customer/membership")}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg shadow-emerald-200 active:scale-[0.99] transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Become a Cooperative Member</p>
              <p className="text-[11px] text-white/80 mt-0.5">Vote on rules & shape the network.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-white/80" />
          </div>
        </button>

        <Button 
          className="w-full h-12 rounded-2xl font-bold bg-gray-900 hover:bg-gray-800"
          onClick={() => navigate("/customer")}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
