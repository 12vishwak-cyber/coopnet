import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ShoppingBag, Heart, User, MapPin, ChevronDown } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">CoopNet</span>
              <div className="flex items-center gap-1 -mt-0.5">
                <MapPin className="h-2.5 w-2.5 text-emerald-600" />
                <span className="text-[10px] text-gray-500 font-medium">MG Road, Bangalore</span>
                <ChevronDown className="h-2.5 w-2.5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold">⚡ 15–20 min</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path || 
            (tab.path !== "/customer" && location.pathname.startsWith(tab.path));
          const isHome = tab.path === "/customer" && location.pathname === "/customer";
          const isActive = active || isHome;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive 
                  ? "text-emerald-600" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{tab.label}</span>
              {isActive && <span className="h-1 w-1 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
