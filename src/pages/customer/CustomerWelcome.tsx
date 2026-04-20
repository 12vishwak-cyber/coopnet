import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, MapPin, Sparkles, ShoppingBag, Milk, Carrot, Coffee, Cookie,
  Zap, Heart, ShieldCheck, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Step = 0 | 1 | 2 | 3;

const interests = [
  { id: "veg", label: "Vegetables", icon: Carrot, color: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600" },
  { id: "dairy", label: "Dairy", icon: Milk, color: "bg-blue-100 dark:bg-blue-500/20 text-blue-600" },
  { id: "snacks", label: "Snacks", icon: Cookie, color: "bg-amber-100 dark:bg-amber-500/20 text-amber-600" },
  { id: "beverages", label: "Beverages", icon: Coffee, color: "bg-rose-100 dark:bg-rose-500/20 text-rose-600" },
  { id: "essentials", label: "Essentials", icon: ShoppingBag, color: "bg-purple-100 dark:bg-purple-500/20 text-purple-600" },
];

const STORAGE_KEY = "coopnet:onboarded:v1";

export default function CustomerWelcome() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [locationGranted, setLocationGranted] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationGranted(true);
      toast.message("Location set to default area");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationGranted(true);
        toast.success("Location detected — Koramangala");
      },
      () => {
        setLocationGranted(true);
        toast.message("Using default area · You can change later");
      },
      { timeout: 4000 }
    );
  };

  const finish = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ done: true, interests: selected, at: new Date().toISOString() })
      );
    } catch {
      /* ignore */
    }
    navigate("/customer");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top progress */}
      <div className="px-4 pt-4 flex items-center gap-1.5">
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              n <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 px-5 py-6 overflow-y-auto pb-32">
        {step === 0 && (
          <div className="text-center pt-10 animate-fade-up">
            <div className="relative mx-auto h-28 w-28 mb-6">
              <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-ping" />
              <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl">
                <span className="text-4xl font-black text-primary-foreground">Co</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-foreground">Welcome to CoopNet</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Quick commerce, owned by the people who shop, sell, and deliver on it.
            </p>

            <div className="mt-8 space-y-3 text-left">
              {[
                { icon: Zap, title: "10–15 min delivery", desc: "From real local stores near you" },
                { icon: Heart, title: "Fair to everyone", desc: "Transparent splits for sellers and riders" },
                { icon: ShieldCheck, title: "No hidden fees", desc: "Every rupee is accounted for" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card rounded-2xl p-4 border border-border flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="pt-6 animate-fade-up">
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">Where should we deliver?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                We'll find the nearest stores and fastest riders for you.
              </p>
            </div>

            <button
              onClick={requestLocation}
              className={`w-full rounded-2xl p-5 border-2 transition-all ${
                locationGranted
                  ? "border-primary bg-primary/5"
                  : "border-dashed border-border bg-card active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  locationGranted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {locationGranted ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-foreground">
                    {locationGranted ? "Location detected" : "Use my current location"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {locationGranted ? "Koramangala, Bengaluru" : "Recommended for the best experience"}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setLocationGranted(true);
                toast.message("Set to Koramangala · Change anytime");
              }}
              className="w-full mt-3 text-xs font-bold text-muted-foreground py-3"
            >
              Skip for now
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="pt-6 animate-fade-up">
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">What do you shop for?</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Pick a few — we'll personalize your home feed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interests.map((it) => {
                const isOn = selected.includes(it.id);
                return (
                  <button
                    key={it.id}
                    onClick={() => toggle(it.id)}
                    className={`rounded-2xl p-4 border-2 transition-all text-left active:scale-95 ${
                      isOn ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-2 ${it.color}`}>
                      <it.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{it.label}</p>
                    {isOn && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                        <Check className="h-3 w-3" /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="pt-6 animate-fade-up">
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground">How CoopNet works</h2>
              <p className="text-sm text-muted-foreground mt-2">A quick look under the hood.</p>
            </div>

            <div className="space-y-3">
              {[
                { n: "1", title: "You shop", desc: "Pick from local stores, get it in ~10 mins." },
                { n: "2", title: "Sellers earn fairly", desc: "75–80% of every order goes straight to the store." },
                { n: "3", title: "Riders earn fairly", desc: "Workers get ₹20–₹50 per trip — not pennies." },
                { n: "4", title: "Community fund grows", desc: "5–8% funds the network — visible on the ledger." },
              ].map((s) => (
                <div key={s.n} className="bg-card rounded-2xl p-4 border border-border flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-extrabold shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex gap-2">
        {step > 0 && (
          <Button
            variant="outline"
            className="h-12 rounded-2xl font-bold px-5"
            onClick={() => setStep((s) => (s - 1) as Step)}
          >
            Back
          </Button>
        )}
        <Button
          className="flex-1 h-12 rounded-2xl font-bold"
          disabled={step === 1 && !locationGranted}
          onClick={() => {
            if (step === 3) finish();
            else setStep((s) => (s + 1) as Step);
          }}
        >
          {step === 3 ? "Start shopping" : "Continue"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
