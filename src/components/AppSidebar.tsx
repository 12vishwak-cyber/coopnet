import {
  LayoutDashboard, ShoppingCart, Package, BarChart3, DollarSign,
  Truck, ClipboardList, MapPin, Route, ArrowLeftRight, Info, User, Settings,
  Globe, Scale, PiggyBank, Database, Vote, Activity, Users, BookOpen,
  AlertCircle, HelpCircle, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar, SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const sellerItems = [
  { title: "Dashboard", url: "/seller", icon: LayoutDashboard },
  { title: "Orders", url: "/seller/orders", icon: ShoppingCart },
  { title: "Inventory", url: "/seller/inventory", icon: Package },
  { title: "Insights", url: "/seller/insights", icon: BarChart3 },
  { title: "Earnings", url: "/seller/earnings", icon: DollarSign },
];

const workerItems = [
  { title: "Dashboard", url: "/worker", icon: LayoutDashboard },
  { title: "Tasks", url: "/worker/tasks", icon: ClipboardList },
  { title: "Delivery", url: "/worker/delivery", icon: Truck },
  { title: "Route", url: "/worker/route", icon: Route },
  { title: "Earnings", url: "/worker/earnings", icon: DollarSign },
];

const networkItems = [
  { title: "Overview", url: "/network", icon: Globe },
  { title: "Members", url: "/network/members", icon: Users },
  { title: "Rules", url: "/network/rules", icon: Scale },
  { title: "Rulebook", url: "/network/rulebook", icon: BookOpen },
  { title: "Fund", url: "/network/fund", icon: PiggyBank },
  { title: "Ledger", url: "/network/ledger", icon: Database },
  { title: "Voting", url: "/network/voting", icon: Vote },
  { title: "Complaints", url: "/network/complaints", icon: AlertCircle },
  { title: "Activity", url: "/network/activity", icon: Activity },
];

const bottomItems = [
  { title: "About", url: "/about", icon: Info },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Help", url: "/help", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const isWorker = location.pathname.startsWith("/worker");
  const items = isWorker ? workerItems : sellerItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary font-semibold tracking-wider text-[10px] uppercase">
            {isWorker ? "Delivery Driver" : "Seller"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-primary font-semibold tracking-wider text-[10px] uppercase">
            Network
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {networkItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent gap-2"
          onClick={() => navigate(isWorker ? "/seller" : "/worker")}
        >
          <ArrowLeftRight className="h-4 w-4" />
          {!collapsed && <span className="text-xs">Switch to {isWorker ? "Seller" : "Driver"}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
