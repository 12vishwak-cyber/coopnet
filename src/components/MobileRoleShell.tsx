import { Home, ShoppingBag, Package, Wallet, User, ClipboardList } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

type Role = "seller" | "worker";

const sellerTabs = [
  { label: "Home", path: "/seller", icon: Home },
  { label: "Orders", path: "/seller/orders", icon: ShoppingBag },
  { label: "Products", path: "/seller/inventory", icon: Package },
  { label: "Earnings", path: "/seller/earnings", icon: Wallet },
  { label: "Profile", path: "/seller/profile", icon: User },
];

const workerTabs = [
  { label: "Home", path: "/worker", icon: Home },
  { label: "Orders", path: "/worker/tasks", icon: ClipboardList },
  { label: "Earnings", path: "/worker/earnings", icon: Wallet },
  { label: "Profile", path: "/worker/profile", icon: User },
];

export default function MobileRoleShell({ children, role }: { children: React.ReactNode; role: Role }) {
  const location = useLocation();
  const tabs = role === "seller" ? sellerTabs : workerTabs;
  const nodeId = role === "seller" ? "Seller-23" : "Worker-07";
  const roleLabel = role === "seller" ? "Seller" : "Delivery Driver";

  return (
    <div className="min-h-svh bg-background text-foreground md:hidden">
      <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-card px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">C</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">CoopNet · {roleLabel}</p>
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Node {nodeId} · connected
            </p>
          </div>
        </div>
        <div className="ml-auto"><ThemeToggle /></div>
      </header>

      <main className="min-h-[calc(100svh-4rem)] overflow-x-hidden px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex h-[68px] max-w-md items-center justify-around px-1">
          {tabs.map((tab) => {
            const exact = tab.path === `/${role}`;
            const active = exact ? location.pathname === tab.path : location.pathname.startsWith(tab.path);
            return (
              <NavLink key={tab.path} to={tab.path} className={`flex min-w-[58px] flex-col items-center gap-1 py-2 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                <tab.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span>{tab.label}</span>
                <span className={`h-1 w-1 rounded-full ${active ? "bg-primary" : "bg-transparent"}`} />
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}