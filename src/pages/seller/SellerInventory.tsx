import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lightbulb, AlertTriangle } from "lucide-react";

const products = [
  { name: "Basmati Rice (5kg)", sku: "GR-001", stock: 45, price: "₹320", status: "available" },
  { name: "Toor Dal (1kg)", sku: "GR-002", stock: 28, price: "₹140", status: "available" },
  { name: "Sunflower Oil (1L)", sku: "GR-003", stock: 5, price: "₹180", status: "low" },
  { name: "Wheat Flour (1kg)", sku: "GR-004", stock: 3, price: "₹42", status: "low" },
  { name: "Sugar (500g)", sku: "GR-005", stock: 8, price: "₹28", status: "low" },
  { name: "Tea Powder (250g)", sku: "GR-006", stock: 34, price: "₹95", status: "available" },
  { name: "Detergent (1kg)", sku: "HH-001", stock: 22, price: "₹120", status: "available" },
];

const suggestions = [
  { item: "Mustard Oil (1L)", reason: "High demand in your area, no nearby sellers stock it" },
  { item: "Packaged Snacks", reason: "Trending category — 34% increase this month" },
];

export default function SellerInventory() {
  const lowStockCount = products.filter(p => p.status === "low").length;

  return (
    <div>
      <PageHeader title="Inventory" description="Manage your product stock" />

      {lowStockCount > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-up">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
          <div>
            <p className="text-sm font-medium">{lowStockCount} items are running low</p>
            <p className="text-xs text-muted-foreground">Consider restocking before demand peaks</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border rounded-lg animate-fade-up stagger-1">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold">Products</h2>
            <Button size="sm" variant="outline" className="text-xs">Add Product</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.sku}>
                  <TableCell className="font-medium text-sm">{p.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{p.sku}</TableCell>
                  <TableCell className="text-sm tabular-nums">{p.stock}</TableCell>
                  <TableCell className="text-sm">{p.price}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-xs h-7">Update</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-card border rounded-lg p-4 animate-fade-up stagger-2 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold">Suggested Items</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Based on area demand and network intelligence</p>
          <div className="space-y-4">
            {suggestions.map((s) => (
              <div key={s.item} className="border rounded-md p-3">
                <p className="text-sm font-medium">{s.item}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.reason}</p>
                <Button size="sm" variant="outline" className="text-xs mt-2 h-7">Add to Inventory</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
