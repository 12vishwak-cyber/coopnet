import { useEffect, useState } from "react";

/**
 * Zepto-style splash screen — shown only on first app open per session.
 * Uses sessionStorage so navigating internally won't re-trigger it.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.sessionStorage.getItem("coopnet:splash-seen");
  });

  useEffect(() => {
    if (!show) return;
    window.sessionStorage.setItem("coopnet:splash-seen", "1");
    const t = window.setTimeout(() => setShow(false), 1900);
    return () => window.clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600 flex flex-col items-center justify-center animate-splash-fade-out">
      <div className="animate-splash-pop flex flex-col items-center">
        <div className="h-24 w-24 rounded-3xl bg-white/95 shadow-2xl shadow-black/20 flex items-center justify-center mb-5">
          <span className="text-5xl font-extrabold bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">C</span>
        </div>
        <p className="text-3xl font-extrabold text-white tracking-tight">CoopNet</p>
        <p className="text-sm text-white/85 font-semibold mt-1.5">Quick commerce, owned together</p>

        <div className="mt-8 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "120ms" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "240ms" }} />
        </div>
      </div>
    </div>
  );
}
