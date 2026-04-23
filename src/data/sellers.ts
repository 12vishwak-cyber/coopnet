// Central seller registry — used by Home feed, Explore tab, and Seller pages.
// Distance is realistic (0.5–2.5 km) and feeds delivery ETA + driver pay calc.

import storeGeneral from "@/assets/stores/general-store.jpg";
import storeFreshMart from "@/assets/stores/fresh-mart.jpg";
import storeGroceries from "@/assets/stores/groceries.jpg";
import storeDairy from "@/assets/stores/dairy.jpg";
import storeProvisions from "@/assets/stores/provisions.jpg";

const u = (id: string) => `https://images.unsplash.com/${id}?w=400&q=75&auto=format&fit=crop`;

export type SellerInfo = {
  id: string;
  name: string;
  distanceKm: number;
  etaMin: number;
  rating: number;
  trust: number; // 0..1, drives ranking + "trusted" badge
  image: string;
  tag?: string;
};

export const SELLERS: SellerInfo[] = [
  { id: "s3", name: "Kumar Groceries", distanceKm: 0.5, etaMin: 12, rating: 4.3, trust: 0.78, image: storeGroceries, tag: "Nearest" },
  { id: "s1", name: "Ravi General Store", distanceKm: 0.8, etaMin: 14, rating: 4.6, trust: 0.86, image: storeGeneral, tag: "Trusted" },
  { id: "s7", name: "MediCare Plus", distanceKm: 0.9, etaMin: 16, rating: 4.7, trust: 0.92, image: u("photo-1576602976047-174e57a47881"), tag: "24×7" },
  { id: "s11", name: "GlowKart", distanceKm: 1.1, etaMin: 18, rating: 4.7, trust: 0.84, image: u("photo-1556228453-efd6c1ff04f6") },
  { id: "s2", name: "Priya Fresh Mart", distanceKm: 1.2, etaMin: 18, rating: 4.8, trust: 0.94, image: storeFreshMart, tag: "Organic" },
  { id: "s9", name: "TechHub Express", distanceKm: 1.4, etaMin: 22, rating: 4.5, trust: 0.81, image: u("photo-1498049794561-7780e7231661") },
  { id: "s4", name: "Lakshmi Dairy", distanceKm: 1.5, etaMin: 13, rating: 4.7, trust: 0.91, image: storeDairy, tag: "Fresh Daily" },
  { id: "s6", name: "Sweet Crumb Bakers", distanceKm: 1.7, etaMin: 17, rating: 4.9, trust: 0.95, image: u("photo-1509440159596-0249088772ff"), tag: "Hot" },
  { id: "s10", name: "HomeStyle Bazaar", distanceKm: 1.8, etaMin: 25, rating: 4.6, trust: 0.83, image: u("photo-1556909114-f6e7ad7d3136") },
  { id: "s5", name: "Ahmed Provisions", distanceKm: 2.1, etaMin: 26, rating: 4.4, trust: 0.79, image: storeProvisions },
  { id: "s8", name: "Threadline Studio", distanceKm: 2.4, etaMin: 32, rating: 4.6, trust: 0.82, image: u("photo-1483985988355-763728e1935b") },
];

export const SELLER_BY_ID: Record<string, SellerInfo> = SELLERS.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<string, SellerInfo>,
);

// Quick driver fare preview — must mirror computePricing's logic loosely.
export function previewDriverPay(distanceKm: number): number {
  const base = 15;
  const perKm = 8;
  return Math.max(22, Math.round(base + Math.max(0, distanceKm - 1) * perKm + distanceKm * 8));
}
