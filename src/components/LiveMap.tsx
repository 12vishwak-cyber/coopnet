import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type LatLng = { lat: number; lng: number };

export type LiveMapProps = {
  seller: LatLng & { label?: string };
  customer: LatLng & { label?: string };
  driver?: (LatLng & { label?: string; bearing?: number }) | null;
  /** 0..1 — animates the driver marker along the fetched route */
  routeProgress?: number;
  className?: string;
  interactive?: boolean;
  /** "driver" mode = zoomed-in, simplified UI for nav. "preview" = shared customer view */
  mode?: "preview" | "driver";
};

/**
 * Real OpenStreetMap-backed Leaflet map (no API token needed).
 *
 * - Seller pickup pin (emerald)
 * - Customer drop pin (blue)
 * - Animated driver pin (amber, pulsing)
 * - Real driving route via the public OSRM demo endpoint, with a straight-line
 *   fallback so the map always renders something useful.
 *
 * `mode="driver"` zooms in tight on the driver and uses thicker route lines
 * so it works as an in-car navigation view.
 */
export default function LiveMap({
  seller,
  customer,
  driver,
  routeProgress = 0,
  className = "h-64 w-full",
  interactive = true,
  mode = "preview",
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const sellerMarkerRef = useRef<L.Marker | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const routeBgLayerRef = useRef<L.Polyline | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [ready, setReady] = useState(false);

  // Mount the map once.
  useEffect(() => {
    if (!containerRef.current) return;
    const navMode = mode === "driver";
    const map = L.map(containerRef.current, {
      center: [(seller.lat + customer.lat) / 2, (seller.lng + customer.lng) / 2],
      zoom: navMode ? 17 : 14,
      zoomControl: interactive && !navMode,
      attributionControl: false,
      dragging: interactive && !navMode,
      scrollWheelZoom: interactive && !navMode,
      doubleClickZoom: interactive && !navMode,
      touchZoom: interactive && !navMode,
      keyboard: interactive && !navMode,
    });
    mapRef.current = map;

    // OSM tiles — use Carto's "voyager" for a calm, modern look.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    sellerMarkerRef.current = L.marker([seller.lat, seller.lng], { icon: pinIcon("#10b981", "S") })
      .bindPopup(seller.label || "Seller pickup")
      .addTo(map);
    customerMarkerRef.current = L.marker([customer.lat, customer.lng], { icon: pinIcon("#3b82f6", "C") })
      .bindPopup(customer.label || "Your address")
      .addTo(map);

    setReady(true);

    // Route fetch: OSRM public demo. Falls back to straight line.
    (async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${seller.lng},${seller.lat};${customer.lng},${customer.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const json = await res.json();
        const coords: [number, number][] = json?.routes?.[0]?.geometry?.coordinates?.map(
          ([lng, lat]: [number, number]) => [lat, lng],
        );
        if (coords && coords.length > 1) {
          setRouteCoords(coords);
        } else {
          setRouteCoords([
            [seller.lat, seller.lng],
            [customer.lat, customer.lng],
          ]);
        }
      } catch {
        setRouteCoords([
          [seller.lat, seller.lng],
          [customer.lat, customer.lng],
        ]);
      }
    })();

    return () => {
      map.remove();
      mapRef.current = null;
      sellerMarkerRef.current = null;
      customerMarkerRef.current = null;
      driverMarkerRef.current = null;
      routeLayerRef.current = null;
      routeBgLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw the route once we have coords.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routeCoords) return;

    routeBgLayerRef.current?.remove();
    routeLayerRef.current?.remove();

    routeBgLayerRef.current = L.polyline(routeCoords, {
      color: "#cbd5e1",
      weight: mode === "driver" ? 10 : 7,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    routeLayerRef.current = L.polyline(routeCoords, {
      color: "#10b981",
      weight: mode === "driver" ? 6 : 4,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    if (mode !== "driver") {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [routeCoords, mode]);

  // Update seller/customer pin positions if they change.
  useEffect(() => {
    sellerMarkerRef.current?.setLatLng([seller.lat, seller.lng]);
  }, [seller.lat, seller.lng]);
  useEffect(() => {
    customerMarkerRef.current?.setLatLng([customer.lat, customer.lng]);
  }, [customer.lat, customer.lng]);

  // Animate driver position along the route.
  const driverPos = useMemo(() => {
    if (routeCoords && routeCoords.length > 1) {
      const t = Math.max(0, Math.min(1, routeProgress));
      const idx = Math.floor(t * (routeCoords.length - 1));
      const next = routeCoords[Math.min(idx + 1, routeCoords.length - 1)];
      const cur = routeCoords[idx];
      const localT = t * (routeCoords.length - 1) - idx;
      return [cur[0] + (next[0] - cur[0]) * localT, cur[1] + (next[1] - cur[1]) * localT] as [
        number,
        number,
      ];
    }
    if (driver) return [driver.lat, driver.lng] as [number, number];
    return null;
  }, [routeCoords, routeProgress, driver]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !driverPos) return;
    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker(driverPos, { icon: driverIcon(), zIndexOffset: 1000 }).addTo(map);
    } else {
      driverMarkerRef.current.setLatLng(driverPos);
    }
    if (mode === "driver") {
      // Keep the driver centered + zoomed-in for navigation.
      map.setView(driverPos, 17, { animate: true });
    }
  }, [driverPos, ready, mode]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="absolute inset-0 rounded-xl overflow-hidden bg-muted" />
    </div>
  );
}

function pinIcon(color: string, letter: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:32px;height:32px;border-radius:50% 50% 50% 0;
        background:${color};transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 10px rgba(0,0,0,0.25);border:2px solid #fff;">
        <span style="transform:rotate(45deg);color:#fff;font-weight:800;font-size:13px;font-family:system-ui,sans-serif;">
          ${letter}
        </span>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

function driverIcon(): L.DivIcon {
  if (typeof document !== "undefined" && !document.getElementById("livemap-pulse-style")) {
    const style = document.createElement("style");
    style.id = "livemap-pulse-style";
    style.textContent = `@keyframes livemap-pulse {
      0% { transform: scale(0.6); opacity: 0.85; }
      80% { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(1.6); opacity: 0; }
    }`;
    document.head.appendChild(style);
  }
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(245,158,11,0.35);animation:livemap-pulse 1.6s ease-out infinite;"></div>
        <div style="position:relative;width:22px;height:22px;border-radius:50%;background:#f59e0b;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,0.25);"></div>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
