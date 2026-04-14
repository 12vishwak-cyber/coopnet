import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Star, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Order Placed", done: true, time: "1:15 PM" },
  { label: "Assigned to Worker", done: true, time: "1:16 PM" },
  { label: "Picked Up", done: true, time: "1:28 PM" },
  { label: "In Transit", done: false, time: "Now" },
  { label: "Delivered", done: false, time: "~1:52 PM" },
  { label: "Recorded in Ledger", done: false, time: "" },
  { label: "Value Distributed", done: false, time: "" },
];

export default function CustomerOrderTracking() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back
      </button>

      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold">Order Tracking</h1>
        <p className="text-xs text-muted-foreground">ORD-1832 · System logic visible</p>
      </div>

      {/* Map */}
      <div className="bg-card border rounded-xl overflow-hidden animate-fade-up stagger-1">
        <div className="relative h-48 bg-muted/50">
          <svg viewBox="0 0 400 180" className="w-full h-full">
            <line x1="0" y1="70" x2="400" y2="70" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            <line x1="0" y1="130" x2="400" y2="130" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            <line x1="130" y1="0" x2="130" y2="180" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            <line x1="270" y1="0" x2="270" y2="180" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            {/* Route */}
            <path d="M80,50 Q150,80 200,70 Q260,55 320,120" fill="none" stroke="hsl(173 58% 45%)" strokeWidth="2.5" strokeDasharray="6,3">
              <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.5s" repeatCount="indefinite" />
            </path>
            {/* Seller */}
            <circle cx="80" cy="50" r="8" fill="hsl(173 58% 45%)" opacity="0.2" />
            <circle cx="80" cy="50" r="4" fill="hsl(173 58% 45%)" />
            <text x="80" y="35" textAnchor="middle" fill="hsl(220 14% 65%)" fontSize="8">Seller</text>
            {/* Worker (animated) */}
            <circle cx="200" cy="70" r="7" fill="hsl(38 85% 55%)" opacity="0.3">
              <animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="70" r="4" fill="hsl(38 85% 55%)" />
            {/* Customer */}
            <circle cx="320" cy="120" r="8" fill="hsl(220 60% 55%)" opacity="0.2" />
            <circle cx="320" cy="120" r="4" fill="hsl(220 60% 55%)" />
            <text x="320" y="105" textAnchor="middle" fill="hsl(220 14% 65%)" fontSize="8">You</text>
          </svg>
          <div className="absolute bottom-2 left-2 flex gap-2 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Seller</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />Worker</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "hsl(220 60% 55%)" }} />You</span>
          </div>
        </div>
      </div>

      {/* Worker Card */}
      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Worker-12 (Arun K.)</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-warning" /> 4.7</span>
              <span>·</span>
              <span>Earnings from this order: ₹38</span>
            </div>
          </div>
          <Truck className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Why This Worker */}
      <div className="bg-accent/30 border border-primary/10 rounded-xl p-4 animate-fade-up stagger-3">
        <p className="text-xs font-medium mb-2 flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> Why this worker?</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>• <strong>Proximity:</strong> Closest available worker (0.3 km from seller)</p>
          <p>• <strong>Load balancing:</strong> Currently carrying 1 order (capacity: 4)</p>
          <p>• <strong>Cooperative rules:</strong> Assignment based on network logic, not bidding</p>
          <p>• <strong>Performance:</strong> 98% on-time delivery rate</p>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-4">
        <h3 className="text-sm font-medium mb-3">Order Flow</h3>
        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                  s.done ? "bg-primary" : i === 3 ? "bg-warning" : "bg-muted"
                }`}>
                  {s.done ? <Check className="h-3 w-3 text-primary-foreground" /> : <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />}
                </div>
                {i < steps.length - 1 && <div className={`w-0.5 h-5 ${s.done ? "bg-primary/30" : "bg-muted"}`} />}
              </div>
              <div>
                <p className={`text-xs ${s.done || i === 3 ? "font-medium" : "text-muted-foreground"}`}>{s.label}</p>
                {s.time && <p className="text-[10px] text-muted-foreground">{s.time}</p>}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">System intelligence updated on every step · Cooperative routing active</p>
      </div>

      <Button className="w-full h-10" variant="outline" onClick={() => navigate("/customer/order/impact")}>
        View Impact After Delivery
      </Button>
    </div>
  );
}
