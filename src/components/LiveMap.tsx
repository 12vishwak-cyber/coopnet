import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";

// Cached at module level so we don't re-fetch the token on every mount.
let tokenPromise: Promise<string> | null = null;
async function getMapboxToken(): Promise<string> {
  if (!tokenPromise) {
    tokenPromise = supabase.functions
      .invoke("get-mapbox-token")
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data?.token) throw new Error("Missing token in response");
        return data.token as string;
      })
      .catch((e) => {
        tokenPromise = null;
        throw e;
      });
  }
  return tokenPromise;
}

export type LatLng = { lat: number; lng: number };

export type LiveMapProps = {
  seller: LatLng & { label?: string };
  customer: LatLng & { label?: string };
  driver?: (LatLng & { label?: string; bearing?: number }) | null;
  routeProgress?: number; // 0..1 — driver position along route
  className?: string;
  interactive?: boolean;
};

/**
 * Realistic Mapbox GL JS map with:
 * - Real OSM-style streets
 * - Seller pickup pin (emerald)
 * - Customer drop pin (blue)
 * - Animated driver pin (amber) that moves along the fetched walking/driving route
 * - Auto-fitting bounds
 *
 * Token is fetched once via the `get-mapbox-token` edge function.
 */
export default function LiveMap({
  seller,
  customer,
  driver,
  routeProgress = 0,
  className = "h-64 w-full",
  interactive = true,
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const sellerMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const customerMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeCoordsRef = useRef<[number, number][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Mount the map once.
  useEffect(() => {
    let cancelled = false;
    let map: mapboxgl.Map | null = null;

    (async () => {
      try {
        const token = await getMapboxToken();
        if (cancelled || !containerRef.current) return;
        mapboxgl.accessToken = token;

        map = new mapboxgl.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [(seller.lng + customer.lng) / 2, (seller.lat + customer.lat) / 2],
          zoom: 14,
          interactive,
          attributionControl: false,
        });
        mapRef.current = map;

        map.on("load", async () => {
          if (cancelled || !map) return;

          // Pickup marker (seller — emerald)
          const sellerEl = makePinElement("#10b981", "S");
          sellerMarkerRef.current = new mapboxgl.Marker({ element: sellerEl })
            .setLngLat([seller.lng, seller.lat])
            .setPopup(new mapboxgl.Popup({ offset: 24 }).setText(seller.label || "Seller pickup"))
            .addTo(map);

          // Drop marker (customer — blue)
          const custEl = makePinElement("#3b82f6", "C");
          customerMarkerRef.current = new mapboxgl.Marker({ element: custEl })
            .setLngLat([customer.lng, customer.lat])
            .setPopup(new mapboxgl.Popup({ offset: 24 }).setText(customer.label || "Your address"))
            .addTo(map);

          // Fetch route from Mapbox Directions API.
          try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${seller.lng},${seller.lat};${customer.lng},${customer.lat}?geometries=geojson&overview=full&access_token=${token}`;
            const res = await fetch(url);
            const json = await res.json();
            const route = json?.routes?.[0]?.geometry;
            if (route?.coordinates) {
              routeCoordsRef.current = route.coordinates as [number, number][];
              map.addSource("route", {
                type: "geojson",
                data: { type: "Feature", properties: {}, geometry: route },
              });
              map.addLayer({
                id: "route-bg",
                type: "line",
                source: "route",
                layout: { "line-cap": "round", "line-join": "round" },
                paint: { "line-color": "#cbd5e1", "line-width": 6 },
              });
              map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: { "line-cap": "round", "line-join": "round" },
                paint: { "line-color": "#10b981", "line-width": 4 },
              });

              // Fit to route.
              const bounds = new mapboxgl.LngLatBounds();
              for (const c of route.coordinates) bounds.extend(c as [number, number]);
              map.fitBounds(bounds, { padding: 50, duration: 600 });
            }
          } catch (routeErr) {
            console.warn("Route fetch failed, falling back to straight line", routeErr);
          }

          // Driver marker (amber pulse).
          if (driver) {
            const drvEl = makeDriverElement();
            driverMarkerRef.current = new mapboxgl.Marker({ element: drvEl })
              .setLngLat([driver.lng, driver.lat])
              .addTo(map);
          }

          setReady(true);
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Map failed to load");
      }
    })();

    return () => {
      cancelled = true;
      sellerMarkerRef.current?.remove();
      customerMarkerRef.current?.remove();
      driverMarkerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update seller/customer positions if they change.
  useEffect(() => {
    sellerMarkerRef.current?.setLngLat([seller.lng, seller.lat]);
  }, [seller.lat, seller.lng]);
  useEffect(() => {
    customerMarkerRef.current?.setLngLat([customer.lng, customer.lat]);
  }, [customer.lat, customer.lng]);

  // Animate driver position along the fetched route.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const coords = routeCoordsRef.current;
    let lng: number;
    let lat: number;

    if (coords && coords.length > 1) {
      const t = Math.max(0, Math.min(1, routeProgress));
      const idx = Math.floor(t * (coords.length - 1));
      const next = coords[Math.min(idx + 1, coords.length - 1)];
      const cur = coords[idx];
      const localT = t * (coords.length - 1) - idx;
      lng = cur[0] + (next[0] - cur[0]) * localT;
      lat = cur[1] + (next[1] - cur[1]) * localT;
    } else if (driver) {
      lng = driver.lng;
      lat = driver.lat;
    } else {
      return;
    }

    if (!driverMarkerRef.current) {
      const drvEl = makeDriverElement();
      driverMarkerRef.current = new mapboxgl.Marker({ element: drvEl })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    } else {
      driverMarkerRef.current.setLngLat([lng, lat]);
    }
  }, [routeProgress, driver, ready]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="absolute inset-0 rounded-xl overflow-hidden bg-muted" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/90 text-sm text-muted-foreground rounded-xl p-4 text-center">
          Map unavailable: {error}
        </div>
      )}
    </div>
  );
}

// Custom DOM marker — a coloured pin with an inner letter.
function makePinElement(color: string, letter: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `
    width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
    background: ${color}; transform: rotate(-45deg);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid #fff;
  `;
  const inner = document.createElement("span");
  inner.textContent = letter;
  inner.style.cssText = `
    transform: rotate(45deg); color: #fff; font-weight: 800;
    font-size: 13px; font-family: system-ui, sans-serif;
  `;
  el.appendChild(inner);
  return el;
}

// Animated pulsing amber circle for the driver.
function makeDriverElement(): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position: relative; width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
  `;
  const pulse = document.createElement("div");
  pulse.style.cssText = `
    position: absolute; inset: -8px;
    border-radius: 50%; background: rgba(245,158,11,0.35);
    animation: livemap-pulse 1.6s ease-out infinite;
  `;
  const dot = document.createElement("div");
  dot.style.cssText = `
    position: relative; width: 22px; height: 22px; border-radius: 50%;
    background: #f59e0b; border: 3px solid #fff;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  `;
  wrap.appendChild(pulse);
  wrap.appendChild(dot);

  // Inject keyframes once.
  if (!document.getElementById("livemap-pulse-style")) {
    const style = document.createElement("style");
    style.id = "livemap-pulse-style";
    style.textContent = `@keyframes livemap-pulse {
      0% { transform: scale(0.6); opacity: 0.85; }
      80% { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(1.6); opacity: 0; }
    }`;
    document.head.appendChild(style);
  }

  return wrap;
}
