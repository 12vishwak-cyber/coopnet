import { PageHeader } from "@/components/PageHeader";
import { MapPin, Clock, Navigation, Globe } from "lucide-react";

const stops = [
  { type: "pickup", address: "MG Road, Shop 3 — Daily Needs", time: "2 min", done: true },
  { type: "delivery", address: "Sector 12, Block A, H-22 — Meera J.", time: "8 min", done: false },
  { type: "pickup", address: "Station Road, B-2 — Kirana Plus", time: "5 min", done: false },
  { type: "delivery", address: "Anand Nagar, H-8 — Suresh P.", time: "7 min", done: false },
];

export default function WorkerRoute() {
  return (
    <div>
      <PageHeader title="Route" description="Optimized delivery route" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border rounded-lg overflow-hidden animate-fade-up stagger-1">
          <div className="aspect-[16/10] bg-muted flex items-center justify-center relative">
            <div className="text-center">
              <Navigation className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Route Map</p>
              <p className="text-[11px] text-muted-foreground mt-1">4 stops · 22 min estimated</p>
              <p className="text-[10px] text-muted-foreground mt-2">Route generated using collective delivery data</p>
            </div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250" fill="none">
              <path d="M80 180 Q120 60 200 120 Q280 180 340 80" stroke="hsl(173 58% 39%)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
              <circle cx="80" cy="180" r="6" fill="hsl(173 58% 39%)" />
              <circle cx="200" cy="120" r="5" fill="hsl(173 58% 39%)" opacity="0.7" />
              <circle cx="280" cy="160" r="5" fill="hsl(173 58% 39%)" opacity="0.7" />
              <circle cx="340" cy="80" r="6" fill="hsl(0 72% 51%)" />
            </svg>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-2 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold">Route Stops</h3>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>~22 min total</span>
            </div>
          </div>

          <div className="space-y-0">
            {stops.map((stop, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${stop.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  {i < stops.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-semibold tracking-wider ${stop.type === "pickup" ? "text-primary" : "text-warning"}`}>
                      {stop.type}
                    </span>
                    {stop.done && <span className="text-[10px] text-success font-medium">✓ Done</span>}
                  </div>
                  <p className="text-sm mt-0.5">{stop.address}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stop.time} from previous</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t">
            <span className="text-primary font-medium flex items-center gap-1 mb-0.5"><Globe className="h-3 w-3" /> Network Optimized</span>
            Shared routing engine active · Optimized across network members
          </p>
        </div>
      </div>
    </div>
  );
}
