import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, ShoppingCart, MapPin, BarChart3, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const demandData = [
  { day: "Mon", orders: 18 }, { day: "Tue", orders: 24 }, { day: "Wed", orders: 21 },
  { day: "Thu", orders: 32 }, { day: "Fri", orders: 28 }, { day: "Sat", orders: 38 }, { day: "Sun", orders: 15 },
];

const popularItems = [
  { name: "Basmati Rice", orders: 142 }, { name: "Cooking Oil", orders: 98 },
  { name: "Wheat Flour", orders: 87 }, { name: "Toor Dal", orders: 76 },
  { name: "Sugar", orders: 64 }, { name: "Tea Powder", orders: 52 },
];

const areaData = [
  { area: "Sector 12", demand: 85 }, { area: "MG Road", demand: 72 },
  { area: "Civil Lines", demand: 68 }, { area: "Gandhi Chowk", demand: 54 },
  { area: "Station Rd", demand: 41 },
];

export default function SellerInsights() {
  return (
    <div>
      <PageHeader title="Collective Intelligence" description="Network demand forecasts and performance analytics" />
      <p className="text-[11px] text-muted-foreground mb-5 -mt-4 animate-fade-up">
        Data from all sellers and workers · Generated from shared ledger · Used for routing and demand forecast
      </p>

      <div className="bg-card border rounded-lg p-5 mb-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-[13px] font-semibold">Network Activity</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-semibold tabular-nums">186</p>
            <p className="text-[11px] text-muted-foreground">Orders today</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">142</p>
            <p className="text-[11px] text-muted-foreground">Deliveries today</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">48</p>
            <p className="text-[11px] text-muted-foreground">Active nodes</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 pt-3 border-t">All members share access to data · No central owner</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Weekly Trend" value="+14.2%" change="Demand rising" changeType="positive" icon={TrendingUp} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Avg. Order Value" value="₹847" change="+₹62 vs last week" changeType="positive" icon={ShoppingCart} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Active Areas" value="5" change="1 new area" changeType="positive" icon={MapPin} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Fulfillment Rate" value="94.7%" change="Above network avg" changeType="positive" icon={BarChart3} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-3">
          <h3 className="text-[13px] font-semibold mb-4">Demand Forecast (7-Day)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-4">
          <h3 className="text-[13px] font-semibold mb-4">Area Demand</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={areaData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={80} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-5">
        <h3 className="text-[13px] font-semibold mb-4">Popular Items This Week</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularItems.map((item) => (
            <div key={item.name} className="border rounded-lg p-3 text-center">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-lg font-semibold text-primary mt-1 tabular-nums">{item.orders}</p>
              <p className="text-[11px] text-muted-foreground">orders</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
