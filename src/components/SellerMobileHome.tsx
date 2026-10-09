import { AlertTriangle, ChevronRight, IndianRupee, Package, Plus, ShoppingBag, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSellerOrders, useSellerProducts } from "@/lib/coopnet-api";
import { MobileNetworkShortcuts } from "@/components/MobileNetworkShortcuts";

const SELLER_ID = "s1";

export default function SellerMobileHome() {
  const orders = useSellerOrders(SELLER_ID);
  const { products } = useSellerProducts(SELLER_ID);
  const needsAction = orders.filter((order) => order.status === "placed" || order.status === "packed");
  const today = new Date().toDateString();
  const todayOrders = orders.filter((order) => new Date(order.created_at).toDateString() === today);
  const sales = todayOrders.reduce((sum, order) => sum + Number(order.seller_earnings || order.total), 0);
  const lowStock = products.filter((product) => !product.in_stock).slice(0, 3);

  return (
    <div className="mx-auto max-w-md space-y-5">
      <section>
        <p className="text-sm text-muted-foreground">Good morning, Ravi</p>
        <div className="mt-1 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Run your shop</h1>
          <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> Open
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Store className="h-3.5 w-3.5" /> Ravi General Store</p>
      </section>

      <section aria-label="Store performance" className="grid grid-cols-2 gap-x-4 gap-y-3 border-y py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><IndianRupee className="h-3.5 w-3.5 text-primary" /> Revenue today</p>
          <p className="mt-1 text-xl font-bold tabular-nums">₹{Math.round(sales || 2480).toLocaleString("en-IN")}</p>
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShoppingBag className="h-3.5 w-3.5 text-primary" /> Orders today</p>
          <p className="mt-1 text-xl font-bold tabular-nums">{todayOrders.length || 18}</p>
        </div>
        <div className="min-w-0">
          <Link to="/seller/inventory" className="flex items-center gap-1.5 text-xs text-muted-foreground"><AlertTriangle className="h-3.5 w-3.5 text-warning" /> Low stock</Link>
          <p className="mt-1 text-xl font-bold tabular-nums">{products.filter((product) => !product.in_stock).length}</p>
        </div>
        <div className="min-w-0">
          <Link to="/seller/inventory" className="flex items-center gap-1.5 text-xs text-muted-foreground"><Package className="h-3.5 w-3.5 text-primary" /> Products</Link>
          <p className="mt-1 text-xl font-bold tabular-nums">{products.length}</p>
        </div>
      </section>

      <MobileNetworkShortcuts />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold">Orders needing action</h2>
          <Link to="/seller/orders" className="text-xs font-semibold text-primary">See all</Link>
        </div>
        {needsAction.length ? needsAction.slice(0, 2).map((order) => (
          <Link key={order.id} to="/seller/orders" className="mb-2 flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><ShoppingBag className="h-5 w-5 text-primary" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{order.short_code}</p>
              <p className="truncate text-xs text-muted-foreground">{order.items.length} items · Prepare in 8 min</p>
            </div>
            <div className="text-right"><p className="text-sm font-bold">₹{Number(order.total).toFixed(0)}</p><ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" /></div>
          </Link>
        )) : (
          <div className="rounded-lg border bg-card p-5 text-center text-sm text-muted-foreground">You’re caught up. New orders appear here instantly.</div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-12 justify-start"><Link to="/seller/inventory/new"><Plus className="mr-2 h-4 w-4" /> Add product</Link></Button>
          <Button asChild variant="outline" className="h-12 justify-start"><Link to="/seller/inventory"><Package className="mr-2 h-4 w-4" /> Inventory</Link></Button>
          <Button asChild variant="outline" className="h-12 justify-start"><Link to="/seller/orders"><ShoppingBag className="mr-2 h-4 w-4" /> Orders</Link></Button>
          <Button asChild variant="outline" className="h-12 justify-start"><Link to="/seller/earnings"><IndianRupee className="mr-2 h-4 w-4" /> Earnings</Link></Button>
        </div>
      </section>

      <section className="rounded-lg border border-warning/30 bg-warning/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
          <div><p className="text-sm font-bold">Low stock</p><p className="mt-1 text-xs text-muted-foreground">{lowStock.length ? lowStock.map((product) => product.name).join(" · ") : "Milk · Bread · Eggs"}</p></div>
        </div>
      </section>
    </div>
  );
}