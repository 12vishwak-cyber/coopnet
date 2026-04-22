import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";

/**
 * FlyToCart — global animation system that draws a small ball from a tap-source
 * element to the cart icon. Provides:
 *   - useFlyToCart()  — call .fly(sourceEl, image?) from any "Add" handler
 *   - <FlyToCartTarget id="cart-icon" /> — invisible anchor placed near cart icon
 *
 * The ball renders at <body> level so it can fly across layouts.
 */

type FlyOptions = {
  image?: string;
  size?: number; // initial ball size px
};

type Ctx = {
  registerTarget: (id: string, el: HTMLElement | null) => void;
  fly: (source: HTMLElement, opts?: FlyOptions) => void;
};

const FlyToCartContext = createContext<Ctx | null>(null);

type Ball = {
  id: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  image?: string;
  size: number;
  phase: "start" | "fly";
};

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const targetsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [balls, setBalls] = useState<Ball[]>([]);
  const idRef = useRef(0);

  const registerTarget = useCallback((id: string, el: HTMLElement | null) => {
    if (el) targetsRef.current.set(id, el);
    else targetsRef.current.delete(id);
  }, []);

  const fly = useCallback((source: HTMLElement, opts: FlyOptions = {}) => {
    // Prefer cart-icon target; fall back to sticky-cart bar; else center-bottom.
    const target =
      targetsRef.current.get("cart-icon") ||
      targetsRef.current.get("sticky-cart") ||
      null;

    const sourceRect = source.getBoundingClientRect();
    const start = {
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2,
    };
    let end: { x: number; y: number };
    if (target) {
      const r = target.getBoundingClientRect();
      end = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    } else {
      end = { x: window.innerWidth / 2, y: window.innerHeight - 60 };
    }

    const id = ++idRef.current;
    const size = opts.size ?? 36;
    setBalls((b) => [...b, { id, start, end, image: opts.image, size, phase: "start" }]);

    // Trigger fly transition next frame
    requestAnimationFrame(() => {
      setBalls((b) => b.map((x) => (x.id === id ? { ...x, phase: "fly" } : x)));
    });

    // Cleanup + cart bounce after animation
    window.setTimeout(() => {
      setBalls((b) => b.filter((x) => x.id !== id));
      if (target) {
        target.classList.remove("cart-bounce");
        // Force reflow to restart animation
        void target.offsetWidth;
        target.classList.add("cart-bounce");
        window.setTimeout(() => target.classList.remove("cart-bounce"), 600);
      }
    }, 760);
  }, []);

  const value = useMemo<Ctx>(() => ({ registerTarget, fly }), [registerTarget, fly]);

  return (
    <FlyToCartContext.Provider value={value}>
      {children}
      {balls.map((b) => {
        const isStart = b.phase === "start";
        const x = isStart ? b.start.x : b.end.x;
        const y = isStart ? b.start.y : b.end.y;
        const scale = isStart ? 1 : 0.35;
        return (
          <div
            key={b.id}
            className="fly-ball"
            style={{
              left: x - b.size / 2,
              top: y - b.size / 2,
              width: b.size,
              height: b.size,
              transform: `scale(${scale})`,
              opacity: isStart ? 1 : 0.35,
              overflow: "hidden",
            }}
            aria-hidden
          >
            {b.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs">+</span>
            )}
          </div>
        );
      })}
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) {
    // Non-throwing fallback so the component can be safely called outside provider
    return { fly: () => {}, registerTarget: () => {} } as Ctx;
  }
  return ctx;
}

/**
 * Place this invisible anchor at the spot where the ball should land
 * (e.g. inside the cart icon container or sticky cart bar).
 */
export function FlyToCartTarget({ id }: { id: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { registerTarget } = useFlyToCart();
  useEffect(() => {
    registerTarget(id, ref.current);
    return () => registerTarget(id, null);
  }, [id, registerTarget]);
  return <span ref={ref} aria-hidden className="absolute inset-0 pointer-events-none" />;
}
