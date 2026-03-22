import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Check, Package, Truck, MapPin, Clock, Globe } from "lucide-react";

const activeDelivery = {
  id: "TSK-411",
  seller: "Daily Needs",
  pickup: { address: "MG Road, Shop 3", contact: "Rajesh P.", phone: "+91 98xxx xxxxx" },
  delivery: { address: "Sector 12, Block A, H-22", contact: "Meera J.", phone: "+91 97xxx xxxxx" },
  items: ["Rice 5kg", "Dal 1kg", "Oil 1L", "Sugar 500g", "Tea 250g"],
  status: "in-transit",
  pickedUp: true,
  delivered: false,
  estimatedTime: "14 min",
};

const statusSteps = [
  { label: "Assigned", done: true, icon: Check },
  { label: "Picked Up", done: true, icon: Package },
  { label: "In Transit", done: true, icon: Truck },
  { label: "Delivered", done: false, icon: MapPin },
];

export default function WorkerDelivery() {
  return (
    <div>
      <PageHeader title="Delivery" description="Active delivery details" />

      <div className="max-w-2xl">
        <div className="bg-card border rounded-lg p-5 mb-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold">{activeDelivery.id}</p>
              <p className="text-xs text-muted-foreground">{activeDelivery.seller}</p>
            </div>
            <StatusBadge status={activeDelivery.status} />
          </div>

          {/* Status timeline */}
          <div className="flex items-center gap-2 mb-6">
            {statusSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <step.icon className="h-3.5 w-3.5" />
                </div>
                <span className={`text-xs ${step.done ? "font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                {i < statusSteps.length - 1 && <div className={`h-px flex-1 ${step.done ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Package className="h-3 w-3" /> Pickup</p>
              <p className="text-sm font-medium">{activeDelivery.pickup.address}</p>
              <p className="text-xs text-muted-foreground mt-1">{activeDelivery.pickup.contact}</p>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Delivery</p>
              <p className="text-sm font-medium">{activeDelivery.delivery.address}</p>
              <p className="text-xs text-muted-foreground mt-1">{activeDelivery.delivery.contact}</p>
            </div>
          </div>

          <div className="border rounded-md p-3 mb-4">
            <p className="text-xs text-muted-foreground mb-2">Items ({activeDelivery.items.length})</p>
            <div className="flex flex-wrap gap-2">
              {activeDelivery.items.map((item) => (
                <span key={item} className="text-xs bg-muted px-2 py-1 rounded">{item}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>ETA: {activeDelivery.estimatedTime}</span>
            </div>
            <Button size="sm">Confirm Delivery</Button>
          </div>

          <div className="border-t pt-3 flex items-center gap-4">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3 text-primary" />
              Delivery recorded in shared ledger
            </p>
            <p className="text-[10px] text-muted-foreground">
              Transaction synced to network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
