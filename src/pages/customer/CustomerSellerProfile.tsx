import { useNavigate, useParams } from "react-router-dom";
import { Star, MapPin, ShoppingCart, ArrowLeft, Clock, Package, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const sellerData: Record<string, { name: string; location: string; rating: number; orders: number; avgTime: string; contribution: number; description: string }> = {
  s1: { name: "Ravi General Store", location: "MG Road, Block A", rating: 4.6, orders: 1240, avgTime: "22 min", contribution: 92, description: "Family-run general store serving the neighborhood for 15 years. Member of CoopNet since 2023." },
  s2: { name: "Priya Fresh Mart", location: "Sector 12, Market Street", rating: 4.8, orders: 890, avgTime: "18 min", contribution: 97, description: "Organic and fresh produce specialist. Top contributor to the cooperative fund." },
  s3: { name: "Kumar Groceries", location: "Main Bazaar, Shop 14", rating: 4.3, orders: 2100, avgTime: "25 min", contribution: 85, description: "Wholesale and retail grocery store. Longest-running member in the network." },
  s4: { name: "Lakshmi Dairy", location: "Dairy Colony, Lane 3", rating: 4.7, orders: 560, avgTime: "15 min", contribution: 94, description: "Fresh dairy products delivered daily. All products sourced from local farms." },
  s5: { name: "Ahmed Provisions", location: "Old Town, Circle Road", rating: 4.4, orders: 1580, avgTime: "28 min", contribution: 88, description: "Large inventory provisions store. Known for bulk order handling." },
};

const products = [
  { name: "Rice (5kg)", price: "₹280" },
  { name: "Wheat Flour (2kg)", price: "₹95" },
  { name: "Cooking Oil (1L)", price: "₹180" },
  { name: "Sugar (1kg)", price: "₹45" },
  { name: "Tea (250g)", price: "₹120" },
  { name: "Salt (1kg)", price: "₹20" },
];

export default function CustomerSellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const seller = sellerData[id || "s1"] || sellerData.s1;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3 w-3" /> Back to Explore
      </button>

      <div className="bg-card border rounded-xl p-5 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold">{seller.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{seller.location}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 text-warning" /> {seller.rating}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{seller.description}</p>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-muted rounded-lg">
            <Package className="h-3.5 w-3.5 mx-auto text-primary mb-0.5" />
            <p className="text-sm font-semibold">{seller.orders.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Orders</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Clock className="h-3.5 w-3.5 mx-auto text-primary mb-0.5" />
            <p className="text-sm font-semibold">{seller.avgTime}</p>
            <p className="text-[10px] text-muted-foreground">Avg Delivery</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Shield className="h-3.5 w-3.5 mx-auto text-primary mb-0.5" />
            <p className="text-sm font-semibold">{seller.contribution}%</p>
            <p className="text-[10px] text-muted-foreground">Network Score</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Network contribution score from shared ledger · Member of cooperative</p>
      </div>

      <div className="bg-card border rounded-xl p-4 animate-fade-up stagger-1">
        <h3 className="text-sm font-medium mb-3">Products</h3>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.name} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm">{p.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{p.price}</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate("/customer/cart")}>
                  <ShoppingCart className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">Prices set by seller · No platform markup · Cooperative network</p>
      </div>
    </div>
  );
}
