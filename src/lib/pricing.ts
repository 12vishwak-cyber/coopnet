// CoopNet pricing engine — single source of truth for fees, contributions,
// and the "Where Your Money Goes" breakdown. Co-op model: minimal platform
// margin, fair per-trip worker pay, transparent community contribution.

export type PricingInput = {
  subtotal: number;          // item total in INR
  distanceKm?: number;       // delivery distance, default 1.8
  discount?: number;         // promo discount applied
  freeDelivery?: boolean;    // free-delivery promo
};

export type PricingBreakdown = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  platformFee: number;       // tiny — co-op overhead
  communityPct: number;      // 0..1
  communityFund: number;
  total: number;             // what the customer pays
  // Distribution of net (subtotal - discount):
  sellerEarnings: number;    // ~78% of net subtotal
  workerEarnings: number;    // delivery fee + bonus, fair per-trip
  systemCost: number;        // platform fee
  // Helpful ratios for charts (relative to total)
  shares: {
    seller: number;
    worker: number;
    community: number;
    system: number;
  };
};

// Free-delivery threshold in INR — keep aligned with sticky cart progress.
export const FREE_DELIVERY_THRESHOLD = 199;
export const DEFAULT_DISTANCE_KM = 1.8;

export function computeDeliveryFee(distanceKm: number, subtotal: number): number {
  if (subtotal <= 0) return 0;
  // Base ₹15, +₹8/km after first km. Capped at ₹45.
  const base = 15;
  const extra = Math.max(0, distanceKm - 1) * 8;
  return Math.min(45, Math.round(base + extra));
}

export function computeWorkerEarnings(distanceKm: number, deliveryFee: number): number {
  // Worker keeps the delivery fee + ₹8/km tip from platform pool.
  // Floor: ₹22 per trip (no surge but no penalty either).
  const tripPay = deliveryFee + Math.round(distanceKm * 8);
  return Math.max(22, tripPay);
}

export function computePricing(input: PricingInput): PricingBreakdown {
  const subtotal = Math.max(0, Math.round(input.subtotal));
  const discount = Math.max(0, Math.min(subtotal, Math.round(input.discount ?? 0)));
  const distanceKm = input.distanceKm ?? DEFAULT_DISTANCE_KM;
  const netGoods = subtotal - discount;

  const rawDelivery = computeDeliveryFee(distanceKm, subtotal);
  const deliveryFee = input.freeDelivery || netGoods >= FREE_DELIVERY_THRESHOLD ? 0 : rawDelivery;
  const workerEarnings = computeWorkerEarnings(distanceKm, rawDelivery);

  // Platform fee is a tiny flat per-order overhead — co-op, not for-profit.
  const platformFee = subtotal > 0 ? 4 : 0;

  // Community fund: 6% of net goods total.
  const communityPct = 0.06;
  const communityFund = Math.round(netGoods * communityPct);

  // Seller gets net goods minus community contribution. No commission.
  const sellerEarnings = Math.max(0, netGoods - communityFund);

  const total = Math.max(0, netGoods + deliveryFee + platformFee);

  const denom = total > 0 ? total : 1;
  return {
    subtotal,
    discount,
    deliveryFee,
    platformFee,
    communityPct,
    communityFund,
    total,
    sellerEarnings,
    workerEarnings,
    systemCost: platformFee,
    shares: {
      seller: sellerEarnings / denom,
      worker: workerEarnings / denom,
      community: communityFund / denom,
      system: platformFee / denom,
    },
  };
}

// Used by StickyCartBar progress.
export function freeDeliveryProgress(subtotal: number): { pct: number; remaining: number; unlocked: boolean } {
  if (subtotal <= 0) return { pct: 0, remaining: FREE_DELIVERY_THRESHOLD, unlocked: false };
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return { pct: 100, remaining: 0, unlocked: true };
  return {
    pct: Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100),
    remaining: FREE_DELIVERY_THRESHOLD - subtotal,
    unlocked: false,
  };
}
