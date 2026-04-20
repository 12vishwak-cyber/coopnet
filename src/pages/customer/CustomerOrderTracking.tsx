import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Star, Truck, User, Phone, MessageCircle, Package, MapPin, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders, ORDER_STAGES, OrderStatus, timeLabel } from "@/contexts/OrdersContext";

// Route path keypoints (must mirror the SVG path below).
// Path: M60,60 Q140,90 200,80 Q260,70 340,140
function pointOnRoute(t: number): { x: number; y: number } {
  // Two quadratic Bezier segments stitched at t=0.5.
  const clamp = Math.max(0, Math.min(1, t));
  if (clamp <= 0.5) {
    const u = clamp / 0.5;
    // B(u) = (1-u)^2 P0 + 2(1-u)u P1 + u^2 P2
    const x = (1 - u) ** 2 * 60 + 2 * (1 - u) * u * 140 + u ** 2 * 200;
    const y = (1 - u) ** 2 * 60 + 2 * (1 - u) * u * 90 + u ** 2 * 80;
    return { x, y };
  }
  const u = (clamp - 0.5) / 0.5;
  const x = (1 - u) ** 2 * 200 + 2 * (1 - u) * u * 260 + u ** 2 * 340;
  const y = (1 - u) ** 2 * 80 + 2 * (1 - u) * u * 70 + u ** 2 * 140;
  return { x, y };
}

export default function CustomerOrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getOrder, activeOrder } = useOrders();
  const order = (id && getOrder(id)) || activeOrder;

  // Auto-redirect to impact screen on delivery.
  useEffect(() => {
    if (order && order.status === "Delivered") {
      const t = setTimeout(() => navigate(`/customer/order/impact/${order.id}`), 2_500);
      return () => clearTimeout(t);
    }
  }, [order, navigate]);

  const workerPos = useMemo(() => {
    if (!order) return { x: 60, y: 60 };
    const stageIdx = ORDER_STAGES.indexOf(order.status);
    // Before "Out for Delivery" the worker sits at the seller pickup.
    if (stageIdx < 3) return pointOnRoute(0);
    if (stageIdx >= 4) return pointOnRoute(1);
    return pointOnRoute(order.workerProgress);
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center">
        <Package className="h-10 w-10 text-gray-300 mb-3" />
        <p className="text-sm font-bold text-gray-900">No active order</p>
        <p className="text-[12px] text-gray-400 mt-1">Place an order to start tracking.</p>
        <Button className="mt-4 rounded-2xl" onClick={() => navigate("/customer")}>
          Go shopping
        </Button>
      </div>
    );
  }

  const stageIdx = ORDER_STAGES.indexOf(order.status);
  const liveLine =
    order.status === "Placed"
      ? "Sent to seller — confirming…"
      : order.status === "Packed"
      ? `Packed by ${order.seller}`
      : order.status === "Assigned"
      ? `${order.worker.name} accepted — heading to pickup`
      : order.status === "Out for Delivery"
      ? order.stopsAhead > 0
        ? `${order.stopsAhead} ${order.stopsAhead === 1 ? "stop" : "stops"} before you`
        : "Arriving at your doorstep"
      : "Delivered ✓";

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-6">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-bold text-gray-900 truncate">Order Tracking</h1>
          <p className="text-[11px] text-gray-400 truncate">{order.id} · {liveLine}</p>
        </div>
        <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
          {order.etaMin > 0 ? `~${order.etaMin} min` : "Arrived"}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Map */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative h-52 bg-gradient-to-br from-emerald-50 to-teal-50">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* road grid */}
              <line x1="0" y1="80" x2="400" y2="80" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="130" y1="0" x2="130" y2="200" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="270" y1="0" x2="270" y2="200" stroke="#e5e7eb" strokeWidth="1" />
              {/* full route */}
              <path
                d="M60,60 Q140,90 200,80 Q260,70 340,140"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* completed segment */}
              <path
                d="M60,60 Q140,90 200,80 Q260,70 340,140"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="6,4"
                strokeLinecap="round"
                pathLength={1}
                strokeDashoffset={0}
                style={{
                  strokeDasharray: `${stageIdx >= 3 ? order.workerProgress : stageIdx >= 4 ? 1 : 0} 1`,
                  transition: "stroke-dasharray 0.4s linear",
                  pathLength: 1,
                }as React.CSSProperties}
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite" />
              </path>

              {/* Seller pin */}
              <circle cx="60" cy="60" r="11" fill="#d1fae5" />
              <circle cx="60" cy="60" r="5" fill="#10b981" />
              <text x="60" y="40" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="700">Seller</text>

              {/* Customer pin */}
              <circle cx="340" cy="140" r="11" fill="#dbeafe" />
              <circle cx="340" cy="140" r="5" fill="#3b82f6" />
              <text x="340" y="165" textAnchor="middle" fill="#1e40af" fontSize="9" fontWeight="700">You</text>

              {/* Worker pin (animated) */}
              <g style={{ transition: "transform 0.4s linear" }} transform={`translate(${workerPos.x}, ${workerPos.y})`}>
                <circle r="14" fill="#fef3c7" opacity="0.6">
                  <animate attributeName="r" values="12;18;12" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle r="7" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              </g>
            </svg>
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
              <p className="text-[11px] font-extrabold text-emerald-600">⚡ {liveLine}</p>
            </div>
          </div>
        </div>

        {/* Worker Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900 truncate">{order.worker.name}</p>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                  <Bike className="h-3 w-3" /> {order.worker.vehicle}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-gray-500">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {order.worker.rating}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-emerald-600 font-medium">Earning ₹{order.worker.earnings}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Phone className="h-4 w-4 text-emerald-600" />
              </button>
              <button className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Live status timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Live Status</h3>
          <div className="space-y-0">
            {ORDER_STAGES.map((stage, i) => {
              const event = order.events.find((e) => e.status === stage);
              const done = stageIdx > i;
              const isCurrent = stageIdx === i;
              const Icon = stage === "Out for Delivery" ? Truck : stage === "Delivered" ? MapPin : stage === "Packed" ? Package : Check;
              return (
                <div key={stage} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      done
                        ? "bg-emerald-500"
                        : isCurrent
                        ? "bg-amber-400 ring-4 ring-amber-100"
                        : "bg-gray-100"
                    }`}>
                      {done ? (
                        <Check className="h-3.5 w-3.5 text-white" />
                      ) : isCurrent ? (
                        <Icon className="h-3 w-3 text-white" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    {i < ORDER_STAGES.length - 1 && (
                      <div className={`w-0.5 h-7 ${done ? "bg-emerald-200" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="-mt-0.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm ${done || isCurrent ? "font-bold text-gray-900" : "text-gray-400 font-medium"}`}>
                        {stage}
                      </p>
                      {event && (
                        <p className="text-[11px] text-gray-400 font-medium">{timeLabel(new Date(event.at))}</p>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {event?.message ?? (isCurrent ? "In progress…" : "Waiting")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why this worker */}
        <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-100">
          <p className="text-[11px] font-bold text-emerald-800 mb-1">🤖 Why this worker?</p>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Assigned by proximity, load capacity, and cooperative rules — not surge pricing.
          </p>
        </div>

        <Button
          className="w-full h-12 rounded-2xl font-bold bg-gray-900 hover:bg-gray-800"
          onClick={() => navigate(`/customer/order/impact/${order.id}`)}
        >
          {order.status === "Delivered" ? "View Impact" : "Skip to Impact Preview"}
        </Button>
      </div>
    </div>
  );
}
