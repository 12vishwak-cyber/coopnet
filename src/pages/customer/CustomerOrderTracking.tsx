import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Star, Truck, User, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Order Placed", done: true, time: "1:15 PM", desc: "Confirmed & sent to seller" },
  { label: "Packed by Seller", done: true, time: "1:22 PM", desc: "Kumar Groceries" },
  { label: "Worker Assigned", done: true, time: "1:24 PM", desc: "Arun K. picked up" },
  { label: "Out for Delivery", done: false, time: "Now", desc: "Arriving in ~8 mins" },
  { label: "Delivered", done: false, time: "~1:52 PM", desc: "" },
];

export default function CustomerOrderTracking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-[15px] font-bold text-gray-900">Order Tracking</h1>
          <p className="text-[11px] text-gray-400">ORD-1832 · Arriving soon</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Map */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50">
            <svg viewBox="0 0 400 180" className="w-full h-full">
              {/* Simple road grid */}
              <line x1="0" y1="70" x2="400" y2="70" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="130" x2="400" y2="130" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="130" y1="0" x2="130" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="270" y1="0" x2="270" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              {/* Route */}
              <path d="M80,50 Q150,80 200,70 Q260,55 320,120" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6,4" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
              </path>
              {/* Seller */}
              <circle cx="80" cy="50" r="10" fill="#d1fae5" />
              <circle cx="80" cy="50" r="5" fill="#10b981" />
              <text x="80" y="30" textAnchor="middle" fill="#6b7280" fontSize="9" fontWeight="600">Seller</text>
              {/* Worker */}
              <circle cx="220" cy="65" r="8" fill="#fef3c7" opacity="0.8">
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="220" cy="65" r="5" fill="#f59e0b" />
              {/* Customer */}
              <circle cx="320" cy="120" r="10" fill="#dbeafe" />
              <circle cx="320" cy="120" r="5" fill="#3b82f6" />
              <text x="320" y="100" textAnchor="middle" fill="#6b7280" fontSize="9" fontWeight="600">You</text>
            </svg>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
              <p className="text-[11px] font-bold text-emerald-600">⚡ Arriving in ~8 mins</p>
            </div>
          </div>
        </div>

        {/* Worker Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Arun K.</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-gray-500">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> 4.7
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-emerald-600 font-medium">Earning ₹38 from this order</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Phone className="h-4 w-4 text-emerald-600" />
              </button>
              <button className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-0">
            {steps.map((s, i) => {
              const isCurrent = !s.done && i === steps.findIndex(st => !st.done);
              return (
                <div key={i} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      s.done 
                        ? "bg-emerald-500" 
                        : isCurrent 
                          ? "bg-amber-400 ring-4 ring-amber-100" 
                          : "bg-gray-100"
                    }`}>
                      {s.done ? (
                        <Check className="h-3.5 w-3.5 text-white" />
                      ) : isCurrent ? (
                        <Truck className="h-3 w-3 text-white" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-0.5 h-6 ${s.done ? "bg-emerald-200" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="-mt-0.5">
                    <p className={`text-sm ${s.done || isCurrent ? "font-bold text-gray-900" : "text-gray-400 font-medium"}`}>{s.label}</p>
                    <div className="flex items-center gap-2">
                      {s.time && <p className="text-[11px] text-gray-400">{s.time}</p>}
                      {s.desc && <p className="text-[11px] text-gray-400">· {s.desc}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why this worker - subtle */}
        <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-100">
          <p className="text-[11px] font-bold text-emerald-800 mb-1">🤖 Why this worker?</p>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Assigned based on proximity (0.3 km), load capacity, and cooperative rules — not surge pricing.
          </p>
        </div>

        <Button 
          className="w-full h-12 rounded-2xl font-bold bg-gray-900 hover:bg-gray-800" 
          onClick={() => navigate("/customer/order/impact")}
        >
          View Impact After Delivery
        </Button>
      </div>
    </div>
  );
}
