import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

export type Banner = {
  title: string;
  subtitle: string;
  /** Background image URL (Unsplash or asset). Drives the visual richness. */
  image: string;
  /** Tailwind gradient overlay classes — e.g. "from-emerald-600/95 to-teal-700/40" */
  overlay: string;
  /** Optional CTA pill label */
  cta?: string;
  /** Optional badge (top-right ribbon, e.g. "FLAT ₹50 OFF") */
  badge?: string;
};

type Props = {
  banners: Banner[];
  onTap?: (index: number) => void;
  intervalMs?: number;
};

/**
 * Zepto-style hero carousel — banners with real product imagery, gradient overlays,
 * bold typography, and a CTA pill. Auto-rotates and pauses on user scroll.
 */
export default function PromoCarousel({ banners, onTap, intervalMs = 4200 }: Props) {
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

  const onScroll = () => {
    pauseUntil.current = Date.now() + 5000;
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
            className="relative min-w-[300px] snap-center rounded-2xl overflow-hidden shadow-lg active:scale-[0.99] transition-transform text-left h-[150px]"
          >
            {/* Background image */}
            <img
              src={b.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              aria-hidden
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${b.overlay}`} aria-hidden />

            {/* Badge ribbon */}
            {b.badge && (
              <span className="absolute top-3 right-3 z-10 text-[10px] font-extrabold bg-white text-rose-600 px-2.5 py-1 rounded-full shadow-md tracking-wide">
                {b.badge}
              </span>
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
              <p className="text-[20px] font-extrabold leading-[1.15] drop-shadow-sm">
                {b.title}
              </p>
              <p className="text-[12px] font-medium opacity-95 mt-0.5 drop-shadow-sm">
                {b.subtitle}
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1 self-start bg-white text-gray-900 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
                {b.cta ?? "Shop Now"} <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-1.5">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
