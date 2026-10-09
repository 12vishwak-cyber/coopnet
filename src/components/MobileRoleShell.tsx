import { useEffect, useState } from "react";
import { Home, ShoppingBag, Package, Wallet, ClipboardList, Menu, ArrowLeftRight, SlidersHorizontal, User } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { sellerItems, workerItems, networkItems, bottomItems } from "@/components/AppSidebar";

type Role = "seller" | "worker";

const sellerTabs = [
  { label: "Home", path: "/seller", icon: Home },
  { label: "Orders", path: "/seller/orders", icon: ShoppingBag },
  { label: "Products", path: "/seller/inventory", icon: Package },
  { label: "Earnings", path: "/seller/earnings", icon: Wallet },
];

const workerTabs = [
  { label: "Home", path: "/worker", icon: Home },
  { label: "Orders", path: "/worker/tasks", icon: ClipboardList },
  { label: "Earnings", path: "/worker/earnings", icon: Wallet },
];

const FULL_KEY = "coopnet-mobile-full-controls";

export default function MobileRoleShell({ children, role }: { children: React.ReactNode; role: Role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [full, setFull] = useState(() => localStorage.getItem(FULL_KEY) === "true");
  const tabs = role === "seller" ? sellerTabs : workerTabs;
  const nodeId = role === "seller" ? "Seller-23" : "Worker-07";
  const roleLabel = role === "seller" ? "Seller" : "Delivery Driver";
  const roleItems = role === "seller" ? sellerItems : workerItems;

  useEffect(() => { localStorage.setItem(FULL_KEY, String(full)); }, [full]);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const sections = [
    { title: roleLabel, items: [...roleItems, { title: "My profile", url: `/${role}/profile`, icon: User }] },
    { title: "Network", items: networkItems },
    { title: "Account", items: bottomItems },
  ];

  return (
    <div data-full-controls={full} className="min-h-svh bg-background text-foreground">
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
          <button onClick={() => setMenuOpen(true)} className={`flex min-w-[58px] flex-col items-center gap-1 py-2 text-[10px] font-medium ${menuOpen ? "text-primary" : "text-muted-foreground"}`}>
            <Menu className="h-5 w-5" />
            <span>More</span>
            <span className="h-1 w-1 rounded-full bg-transparent" />
          </button>
        </div>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="bottom" className="max-h-[85svh] overflow-y-auto no-scrollbar rounded-t-2xl">
          <SheetHeader className="text-left"><SheetTitle>Everything you can do</SheetTitle></SheetHeader>

          <label className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold">All controls</p>
              <p className="text-[11px] text-muted-foreground">Show the full desktop tools on every screen</p>
            </div>
            <Switch checked={full} onCheckedChange={setFull} />
          </label>

          {sections.map((section) => (
            <div key={section.title} className="mt-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{section.title}</p>
              <div className="grid grid-cols-2 gap-2">
                {section.items.map((item) => {
                  const active = location.pathname === item.url;
                  return (
                    <NavLink key={item.url + item.title} to={item.url} className={`flex min-h-12 items-center gap-2 rounded-lg border p-3 text-sm font-medium ${active ? "border-primary bg-primary/10 text-primary" : "bg-card"}`}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate(role === "worker" ? "/seller" : "/worker")}
            className="mt-5 flex w-full min-h-12 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold"
          >
            <ArrowLeftRight className="h-4 w-4" /> Switch to {role === "worker" ? "Seller" : "Driver"}
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
