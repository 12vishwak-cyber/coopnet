import { Activity, MapPin, TrendingUp, Users, Truck, Zap } from "lucide-react";

const trendingItems = [
  { name: "Fresh Vegetables", demand: "High", sellers: 12 },
  { name: "Dairy Products", demand: "Medium", sellers: 8 },
  { name: "Groceries", demand: "High", sellers: 15 },
];

const networkEvents = [
  { text: "Order #1847 delivered via cooperative routing", time: "2m ago" },
  { text: "Worker-12 completed 5 deliveries today", time: "8m ago" },
  { text: "Seller-09 joined the network", time: "15m ago" },
  { text: "Fund contribution: ₹2,400 this hour", time: "22m ago" },
];

export default function CustomerHome() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold">Good evening, Customer</h1>
        <p className="text-xs text-muted-foreground mt-0.5">You are inside the cooperative network</p>
      </div>

      {/* Network Status Cards */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-1">
        <div className="bg-card border rounded-xl p-3 text-center">
          <Users className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="text-lg font-semibold">24</p>
          <p className="text-[10px] text-muted-foreground">Sellers Online</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <Truck className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="text-lg font-semibold">12</p>
          <p className="text-[10px] text-muted-foreground">Workers Active</p>
        </div>
        <div className="bg-card border rounded-xl p-3 text-center">
          <Zap className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="text-lg font-semibold">Medium</p>
          <p className="text-[10px] text-muted-foreground">Demand Level</p>
        </div>
      </div>

      {/* Live Network Map */}
      <div className="bg-card border rounded-xl overflow-hidden animate-fade-up stagger-2">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Live Network Map</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Real-time · Cooperative routing active</span>
        </div>
        <div className="relative h-56 bg-muted/50">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <defs>
              <radialGradient id="heat1" cx="30%" cy="40%" r="25%">
                <stop offset="0%" stopColor="hsl(173 58% 45%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(173 58% 45%)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heat2" cx="70%" cy="55%" r="20%">
                <stop offset="0%" stopColor="hsl(38 85% 55%)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(38 85% 55%)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Heat zones */}
            <rect width="400" height="200" fill="url(#heat1)" />
            <rect width="400" height="200" fill="url(#heat2)" />
            {/* Road grid */}
            <line x1="0" y1="80" x2="400" y2="80" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            <line x1="0" y1="140" x2="400" y2="140" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            <line x1="120" y1="0" x2="120" y2="200" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            <line x1="280" y1="0" x2="280" y2="200" stroke="hsl(220 14% 25%)" strokeWidth="0.5" />
            {/* Delivery routes */}
            <path d="M100,60 Q180,90 240,70 T340,120" fill="none" stroke="hsl(173 58% 45%)" strokeWidth="2" strokeDasharray="6,3" opacity="0.7">
              <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M60,150 Q140,120 200,140 T320,90" fill="none" stroke="hsl(220 60% 55%)" strokeWidth="2" strokeDasharray="6,3" opacity="0.5">
              <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="2.5s" repeatCount="indefinite" />
            </path>
            {/* Seller nodes */}
            {[[100,60],[180,130],[280,70],[340,120],[60,150]].map(([x,y], i) => (
              <g key={`s${i}`}>
                <circle cx={x} cy={y} r="8" fill="hsl(173 58% 45%)" opacity="0.2" />
                <circle cx={x} cy={y} r="4" fill="hsl(173 58% 45%)" />
              </g>
            ))}
            {/* Worker nodes (animated) */}
            {[[150,90],[250,110],[200,60]].map(([x,y], i) => (
              <g key={`w${i}`}>
                <circle cx={x} cy={y} r="6" fill="hsl(38 85% 55%)" opacity="0.3">
                  <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" begin={`${i*0.5}s`} />
                </circle>
                <circle cx={x} cy={y} r="3" fill="hsl(38 85% 55%)" />
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 left-2 flex gap-3 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" />Sellers</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning inline-block" />Workers</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary/30 inline-block" />Demand zones</span>
          </div>
        </div>
      </div>

      {/* Network Insights */}
      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-3">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Network Insights</span>
        </div>
        <div className="space-y-2">
          {trendingItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-1.5 border-b last:border-0">
              <span className="text-sm">{item.name}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{item.sellers} sellers</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  item.demand === "High" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                }`}>{item.demand}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">Based on collective intelligence from all network nodes</p>
      </div>

      {/* Live Activity */}
      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Live Network Activity</span>
        </div>
        <div className="space-y-2">
          {networkEvents.map((e, i) => (
            <div key={i} className="flex items-start gap-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs">{e.text}</p>
                <p className="text-[10px] text-muted-foreground">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        You are a participant in this network · Not just a consumer
      </p>
    </div>
  );
}
