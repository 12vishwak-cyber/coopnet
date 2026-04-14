import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Shield, Truck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const sellers = [
  { id: "s1", name: "Ravi General Store", distance: "0.8 km", rating: 4.6, contribution: 92, tags: ["Fast delivery", "Trusted seller"], items: 48 },
  { id: "s2", name: "Priya Fresh Mart", distance: "1.2 km", rating: 4.8, contribution: 97, tags: ["High contribution", "Organic"], items: 35 },
  { id: "s3", name: "Kumar Groceries", distance: "0.5 km", rating: 4.3, contribution: 85, tags: ["Fast delivery"], items: 62 },
  { id: "s4", name: "Lakshmi Dairy", distance: "1.5 km", rating: 4.7, contribution: 94, tags: ["Trusted seller", "High contribution"], items: 22 },
  { id: "s5", name: "Ahmed Provisions", distance: "2.1 km", rating: 4.4, contribution: 88, tags: ["Fast delivery", "Bulk orders"], items: 55 },
];

const items = [
  { name: "Rice (5kg)", price: "₹280", seller: "Kumar Groceries", distance: "0.5 km" },
  { name: "Milk (1L)", price: "₹56", seller: "Lakshmi Dairy", distance: "1.5 km" },
  { name: "Cooking Oil (1L)", price: "₹180", seller: "Ravi General Store", distance: "0.8 km" },
  { name: "Fresh Tomatoes (1kg)", price: "₹40", seller: "Priya Fresh Mart", distance: "1.2 km" },
  { name: "Wheat Flour (2kg)", price: "₹95", seller: "Ahmed Provisions", distance: "2.1 km" },
];

export default function CustomerExplore() {
  const [tab, setTab] = useState<"sellers" | "items">("sellers");
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold">Explore Network</h1>
        <p className="text-xs text-muted-foreground">Choose who to buy from · Seller-first discovery</p>
      </div>

      <div className="relative animate-fade-up stagger-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search sellers or items..." className="pl-9 h-10" />
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 animate-fade-up stagger-1">
        <button
          onClick={() => setTab("sellers")}
          className={`flex-1 text-sm py-2 rounded-md transition-colors ${tab === "sellers" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
        >Sellers</button>
        <button
          onClick={() => setTab("items")}
          className={`flex-1 text-sm py-2 rounded-md transition-colors ${tab === "items" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
        >Items</button>
      </div>

      {tab === "sellers" ? (
        <div className="space-y-3 animate-fade-up stagger-2">
          {sellers.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/customer/seller/${s.id}`)}
              className="w-full text-left bg-card border rounded-xl p-4 card-hover hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{s.distance}</span>
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-warning" />{s.rating}</span>
                    <span>{s.items} items</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-primary bg-accent rounded-full px-2 py-0.5">
                  <Shield className="h-3 w-3" />
                  {s.contribution}%
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {s.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                    {t === "Fast delivery" && <Truck className="h-2.5 w-2.5" />}
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Network Contribution Score · Based on shared ledger data</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2 animate-fade-up stagger-2">
          {items.map((item, i) => (
            <div key={i} className="bg-card border rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.seller} · {item.distance}</p>
              </div>
              <span className="text-sm font-semibold">{item.price}</span>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground text-center pt-2">
            Prices set by sellers · No platform markup · Cooperative network
          </p>
        </div>
      )}
    </div>
  );
}
