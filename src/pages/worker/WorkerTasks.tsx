import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, MapPin, Globe, Clock, Navigation } from "lucide-react";
import { useActiveOrders, assignDriver } from "@/lib/coopnet-api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const tasks = [
  { id: "TSK-415", seller: "Sharma General Store", pickup: "MG Road, Shop 7", delivery: "Sector 12, Block C, H-14", items: 3, distance: "2.4 km", pay: "₹65", status: "pending", suggested: true, priority: 92, load: "Light" },
  { id: "TSK-414", seller: "Kirana Plus", pickup: "Station Road, B-2", delivery: "Anand Nagar, H-8", items: 2, distance: "3.1 km", pay: "₹72", status: "pending", suggested: false, priority: 78, load: "Medium" },
  { id: "TSK-412", seller: "Fresh Mart", pickup: "Civil Lines, C-12", delivery: "Gandhi Chowk, Near Temple", items: 1, distance: "1.8 km", pay: "₹45", status: "assigned", suggested: false, priority: 65, load: "Light" },
  { id: "TSK-411", seller: "Daily Needs", pickup: "MG Road, Shop 3", delivery: "Sector 12, Block A", items: 5, distance: "2.2 km", pay: "₹85", status: "in-transit", suggested: false, priority: 71, load: "Heavy" },
  { id: "TSK-410", seller: "Sharma General Store", pickup: "MG Road, Shop 7", delivery: "Civil Lines, D-4", items: 2, distance: "1.5 km", pay: "₹48", status: "completed", suggested: false, priority: 60, load: "Light" },
];

export default function WorkerTasks() {
  const liveOrders = useActiveOrders();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);
  const accept = async (id: string) => { setBusy(id); try { await assignDriver(id, 12.9756, 77.605); toast.success("Order accepted"); navigate("/worker/delivery"); } catch { toast.error("Couldn’t accept order"); } finally { setBusy(null); } };
  return (
    <div>
      <div className="mobile-variant md:hidden">
        <div className="mb-5"><p className="text-xs text-muted-foreground">Nearby and active work</p><h1 className="text-2xl font-bold">Orders</h1></div>
        <div className="space-y-3">{liveOrders.map((order) => <div key={order.id} className="rounded-lg border bg-card p-4"><div className="flex items-start justify-between"><div><p className="text-sm font-bold">{order.short_code}</p><p className="text-xs text-muted-foreground">{order.items.length} items</p></div><p className="text-xl font-bold">₹{Number(order.driver_earnings || Math.max(25, 20 + Number(order.distance_km) * 12)).toFixed(0)}</p></div><div className="mt-4 space-y-2 border-y py-3 text-xs"><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Pickup at Ravi General Store</p><p className="flex items-center gap-2"><Navigation className="h-4 w-4 text-primary" /> {Number(order.distance_km).toFixed(1)} km route</p><p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> About 14 min</p></div>{!order.driver_id ? <div className="mt-3 grid grid-cols-[1fr_2fr] gap-2"><Button variant="outline" className="h-11">Reject</Button><Button className="h-11" disabled={busy === order.id} onClick={() => accept(order.id)}>Accept order</Button></div> : <Button className="mt-3 h-11 w-full" onClick={() => navigate("/worker/delivery")}>Continue delivery</Button>}</div>)}{!liveOrders.length && <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">No available orders right now.</div>}</div>
      </div>
      <div className="full-controls hidden md:block">
      <PageHeader title="Tasks" description="View and manage delivery tasks" />
      <p className="text-[11px] text-muted-foreground mb-4 -mt-4 animate-fade-up">Tasks assigned based on cooperative routing logic · Tasks generated using shared routing logic</p>

      <div className="bg-card border rounded-lg animate-fade-up stagger-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>
                <span className="flex items-center gap-1">Priority <span className="text-[9px] text-primary font-normal">(network)</span></span>
              </TableHead>
              <TableHead>Dist.</TableHead>
              <TableHead>Load</TableHead>
              <TableHead>Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t.id} className={t.suggested ? "bg-accent/50" : ""}>
                <TableCell className="font-medium text-sm">
                  <div className="flex items-center gap-1.5">
                    {t.id}
                    {t.suggested && <Globe className="h-3 w-3 text-primary" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{t.seller}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate"><MapPin className="h-3 w-3 inline mr-1" />{t.pickup}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[120px] truncate"><MapPin className="h-3 w-3 inline mr-1" />{t.delivery}</TableCell>
                <TableCell className="text-sm tabular-nums">{t.priority}</TableCell>
                <TableCell className="text-sm tabular-nums">{t.distance}</TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{t.load}</TableCell>
                <TableCell className="text-sm font-medium tabular-nums">{t.pay}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell className="text-right">
                  {t.status === "pending" && (
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success hover:text-success"><Check className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive"><X className="h-3.5 w-3.5" /></Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-[10px] text-muted-foreground mt-3 animate-fade-up stagger-2">
        <Globe className="h-3 w-3 inline text-primary mr-1" />
        Highlighted tasks are suggested by network · Network assignment active · Routing generated by network
      </p>
      </div>
    </div>
  );
}
