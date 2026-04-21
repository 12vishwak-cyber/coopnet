import { useEffect, useRef, useState } from "react";

type Banner = {
  title: string;
  subtitle: string;
  bg: string;
  emoji: string;
};

type Props = {
  banners: Banner[];
  onTap?: (index: number) => void;
  intervalMs?: number;
};

/**
 * Auto-rotating promo carousel with snap-aware indicator and tap support.
 * Pauses while the user is interacting (touchstart) for a few seconds.
 */
export default function PromoCarousel({ banners, onTap, intervalMs = 3800 }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pauseUntil = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current) return;
      setActive((cur) => {
        const next = (cur + 1) % banners.length;
        const el = scrollerRef.current;
        if (el) {
          const child = el.children[next] as HTMLElement | undefined;
          if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [banners.length, intervalMs]);

  // Track manual scroll → update indicator + pause auto-rotation briefly.
  const onScroll = () => {
    pauseUntil.current = Date.now() + 4500;
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const node = c as HTMLElement;
      const mid = node.offsetLeft + node.clientWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    setActive(bestIdx);
  };

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {banners.map((b, i) => (
          <button
            key={i}
            onClick={() => onTap?.(i)}
            className={`min-w-[280px] snap-center bg-gradient-to-r ${b.bg} rounded-2xl p-5 text-white flex items-center justify-between shadow-lg active:scale-[0.99] transition-transform text-left`}
          >
            <div>
              <p className="text-lg font-extrabold leading-tight">{b.title}</p>
              <p className="text-xs font-medium opacity-90 mt-1">{b.subtitle}</p>
              <span className="mt-3 inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full">
                Shop Now →
              </span>
            </div>
            <span className="text-5xl ml-2">{b.emoji}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-1.5">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-emerald-500" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
