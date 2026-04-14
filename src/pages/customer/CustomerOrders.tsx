import { useNavigate } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";

const orders = [
  { id: "ORD-1847", seller: "Kumar Groceries", items: 3, total: "₹572", status: "Delivered", date: "Today, 2:30 PM", worker: "Worker-07" },
  { id: "ORD-1832", seller: "Priya Fresh Mart", items: 2, total: "₹320", status: "In Transit", date: "Today, 1:15 PM", worker: "Worker-12" },
  { id: "ORD-1819", seller: "Ravi General Store", items: 5, total: "₹890", status: "Delivered", date: "Yesterday", worker: "Worker-03" },
  { id: "ORD-1801", seller: "Lakshmi Dairy", items: 1, total: "₹56", status: "Delivered", date: "2 days ago", worker: "Worker-09" },
];

const statusColor: Record<string, string> = {
  "Delivered": "text-success",
  "In Transit": "text-warning",
  "Preparing": "text-primary",
};

export default function CustomerOrders() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="animate-fade-up">
        <h1 className="text-lg font-semibold">Your Orders</h1>
        <p className="text-xs text-muted-foreground">All transactions stored in shared ledger</p>
      </div>

      <div className="space-y-3">
        {orders.map((o, i) => (
          <button
            key={o.id}
            onClick={() => o.status === "In Transit" ? navigate("/customer/order/track") : navigate("/customer/order/impact")}
            className={`w-full text-left bg-card border rounded-xl p-4 card-hover animate-fade-up stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{o.seller}</p>
                  <p className="text-[11px] text-muted-foreground">{o.id} · {o.items} items · {o.total}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{o.date} · Assigned: {o.worker}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${statusColor[o.status] || "text-muted-foreground"}`}>{o.status}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {o.status === "Delivered" ? "Transaction recorded · Value distributed via cooperative rules" : "Cooperative routing active · Worker assigned by network logic"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
