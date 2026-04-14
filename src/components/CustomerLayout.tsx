import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ShoppingBag, Globe, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const tabs = [
  { label: "Home", icon: Home, path: "/customer" },
  { label: "Explore", icon: Search, path: "/customer/explore" },
  { label: "Orders", icon: ShoppingBag, path: "/customer/orders" },
  { label: "Network", icon: Globe, path: "/customer/network" },
  { label: "Profile", icon: User, path: "/customer/profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 flex items-center border-b bg-card px-4 gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Globe className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">CoopNet</span>
        </div>
        <div className="flex items-center gap-3 ml-auto text-[11px] text-muted-foreground">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block animate-pulse" />
            Connected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
            Network active
          </span>
          <span className="hidden md:inline text-muted-foreground">48 nodes · 12 workers</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t flex items-center justify-around px-2 z-50">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path || 
            (tab.path !== "/customer" && location.pathname.startsWith(tab.path));
          const isHome = tab.path === "/customer" && location.pathname === "/customer";
          const isActive = active || isHome;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
