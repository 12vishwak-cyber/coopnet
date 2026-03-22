import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, ShoppingCart, MapPin, BarChart3 } from "lucide-react";
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
      <PageHeader title="Insights" description="Demand forecasts and performance analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="animate-fade-up stagger-1"><StatCard title="Weekly Trend" value="+14.2%" change="Demand rising" changeType="positive" icon={TrendingUp} /></div>
        <div className="animate-fade-up stagger-2"><StatCard title="Avg. Order Value" value="₹847" change="+₹62 vs last week" changeType="positive" icon={ShoppingCart} /></div>
        <div className="animate-fade-up stagger-3"><StatCard title="Active Areas" value="5" change="1 new area" changeType="positive" icon={MapPin} /></div>
        <div className="animate-fade-up stagger-4"><StatCard title="Fulfillment Rate" value="94.7%" change="Above network avg" changeType="positive" icon={BarChart3} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-3">
          <h3 className="text-sm font-semibold mb-4">Demand Forecast (7-Day)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 18% 89%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(173 58% 39%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-4">
          <h3 className="text-sm font-semibold mb-4">Area Demand</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={areaData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 18% 89%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
              <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={80} stroke="hsl(220 10% 46%)" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="demand" fill="hsl(173 58% 39%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-5">
        <h3 className="text-sm font-semibold mb-4">Popular Items This Week</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularItems.map((item, i) => (
            <div key={item.name} className="border rounded-md p-3 text-center">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-lg font-semibold text-primary mt-1 tabular-nums">{item.orders}</p>
              <p className="text-xs text-muted-foreground">orders</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
