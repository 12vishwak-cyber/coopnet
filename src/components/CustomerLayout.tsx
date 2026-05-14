import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ShoppingBag, Heart, User, MapPin, ChevronDown } from "lucide-react";
import StickyCartBar from "@/components/StickyCartBar";
import { FlyToCartTarget } from "@/contexts/FlyToCartContext";

const tabs = [
  { label: "Home", icon: Home, path: "/customer" },
  { label: "Explore", icon: Search, path: "/customer/explore" },
  { label: "Orders", icon: ShoppingBag, path: "/customer/orders" },
  { label: "Impact", icon: Heart, path: "/customer/network" },
  { label: "Profile", icon: User, path: "/customer/profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-foreground">
      {/* Header */}
      <header className="bg-card sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-sm">C</span>
            </div>
            <div>
              <span className="text-[15px] font-extrabold text-foreground tracking-tight">CoopNet</span>
              <button className="flex items-center gap-1 -mt-0.5">
                <MapPin className="h-2.5 w-2.5 text-primary" />
                <span className="text-[10px] text-muted-foreground font-medium">MG Road, Bangalore</span>
                <ChevronDown className="h-2.5 w-2.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[11px] font-bold">⚡ 10–15 min</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Sticky cart bar — hidden on the cart page itself to avoid covering the Pay CTA */}
      {location.pathname !== "/customer/cart" && <StickyCartBar />}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-card border-t border-border flex items-center justify-around px-2 z-50">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path ||
            (tab.path !== "/customer" && location.pathname.startsWith(tab.path));
          const isHome = tab.path === "/customer" && location.pathname === "/customer";
          const isActive = active || isHome;
          const isOrders = tab.path === "/customer/orders";
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all active:scale-90 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <tab.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                {/* Anchor for the flying-cart animation — lives on the Orders tab icon */}
                {isOrders && <FlyToCartTarget id="cart-icon" />}
              </div>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{tab.label}</span>
              {isActive && <span className="h-1 w-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
