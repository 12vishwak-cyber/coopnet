import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SafeImage from "@/components/SafeImage";

/**
 * Suggest a fair selling price using the median of comparable products in the
 * same category. Falls back to category-defaults when the local catalog is
 * empty. The hint is non-blocking — sellers can override.
 */
const CATEGORY_DEFAULTS: Record<Category, number> = {
  Vegetables: 35,
  Fruits: 90,
  Dairy: 65,
  Snacks: 60,
  Essentials: 95,
  Bakery: 120,
  Beverages: 70,
  Specials: 150,
  Fashion: 599,
  Pharmacy: 180,
  Electronics: 899,
  Home: 350,
  "Personal Care": 249,
};

function suggestPrice(category: Category): { value: number; sample: number } {
  const peers = PRODUCTS.filter((p) => p.category === category).map((p) => p.price);
  if (!peers.length) return { value: CATEGORY_DEFAULTS[category], sample: 0 };
  const sorted = [...peers].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return { value: Math.round(median), sample: peers.length };
}

function PriceSuggestion({
  category,
  currentPrice,
  onApply,
}: {
  category: Category;
  currentPrice: number;
  onApply: (price: number) => void;
}) {
  const { value, sample } = suggestPrice(category);
  const diff = currentPrice > 0 ? Math.round(((currentPrice - value) / value) * 100) : 0;
  const tone =
    currentPrice === 0 || Math.abs(diff) <= 15
      ? "fair"
      : diff > 15
      ? "high"
      : "low";

  const message =
    tone === "fair"
      ? sample > 0
        ? `Based on ${sample} comparable ${category.toLowerCase()} items in the network.`
        : `Typical range for ${category.toLowerCase()}.`
      : tone === "high"
      ? `${diff}% above market — customers may pick a cheaper seller.`
      : `${Math.abs(diff)}% below market — you may be leaving money on the table.`;

  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-blue-800 dark:text-blue-200">
          Suggested price · ₹{value}{" "}
          <span className="font-medium text-blue-700/80 dark:text-blue-300/80">
            (based on market)
          </span>
        </p>
        <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-0.5 leading-snug">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onApply(value)}
        className="text-[11px] font-bold text-blue-700 dark:text-blue-200 bg-card border border-blue-500/40 rounded-md px-2.5 py-1 hover:bg-blue-500/20 transition-colors shrink-0"
      >
        Use ₹{value}
      </button>
    </div>
  );
}

const ACTING_SELLER_ID = "s1";
const STEPS = ["Images", "Details", "Pricing", "Review"] as const;
type Step = (typeof STEPS)[number];

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("Images");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Vegetables");
  const [unit, setUnit] = useState("1 kg");
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null);

  const stepIdx = STEPS.indexOf(step);
  const next = () => setStep(STEPS[Math.min(stepIdx + 1, STEPS.length - 1)]);
  const prev = () => setStep(STEPS[Math.max(stepIdx - 1, 0)]);

  const canProceed = (() => {
    if (step === "Images") return imageUrl.trim().length > 6;
    if (step === "Details") return name.trim().length > 2 && description.trim().length > 8;
    if (step === "Pricing") return Number(price) > 0;
    return true;
  })();

  const addGalleryImage = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    if (galleryUrls.includes(trimmed)) return;
    setGalleryUrls((g) => [...g, trimmed].slice(0, 6));
  };

  const removeGalleryImage = (url: string) =>
    setGalleryUrls((g) => g.filter((u) => u !== url));

  const submit = async () => {
    setBusy(true);
    try {
      const id = `p_user_${Date.now().toString(36)}`;
      const { error } = await supabase.functions.invoke("seller-add-products", {
        body: {
          sellerId: ACTING_SELLER_ID,
          products: [{
            id,
            name: name.trim(),
            description: description.trim(),
            category,
            unit,
            price: Number(price),
            original_price: originalPrice ? Number(originalPrice) : null,
            image: imageUrl.trim(),
            gallery_images: galleryUrls,
            in_stock: true,
          }],
        },
      });
      if (error) {
        toast.error("Couldn't save product");
        console.warn(error);
        return;
      }
      toast.success(`${name.trim()} added to inventory`);
      setCreated({ id, name: name.trim() });
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    return (
      <div>
        <PageHeader title="Product Added" description="Your product is live in the network" />
        <div className="bg-card rounded-2xl p-6 border border-border max-w-md mx-auto text-center animate-fade-up">
          <div className="h-14 w-14 rounded-full bg-emerald-500/15 mx-auto mb-3 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-foreground">{created.name} is live</p>
          <p className="text-xs text-muted-foreground mt-1">
            Customers in your area can now order this product.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/seller/inventory")}>
              View inventory
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => {
                setCreated(null);
                setStep("Images");
                setImageUrl("");
                setGalleryUrls([]);
                setName("");
                setDescription("");
                setPrice("");
                setOriginalPrice("");
              }}
            >
              Add another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Add Product" description="List a new item to your store" />

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6 max-w-xl">
        {STEPS.map((s, i) => {
          const active = i === stepIdx;
          const done = i < stepIdx;
          return (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl p-5 border border-border max-w-xl space-y-4 animate-fade-up">
        {step === "Images" && (
          <>
            <div>
              <Label className="text-xs font-semibold">Cover image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 h-11"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Tip: paste an Unsplash/CDN URL — image will render instantly with category fallback.
              </p>
            </div>

            {imageUrl && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                <SafeImage src={imageUrl} category={category} alt="cover preview" className="h-full w-full object-cover" />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Gallery (optional)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addGalleryImage}
                  disabled={!imageUrl.trim() || galleryUrls.length >= 6}
                  className="h-8 text-xs"
                >
                  <ImagePlus className="h-3 w-3 mr-1" /> Add current URL
                </Button>
              </div>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {galleryUrls.map((url) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <SafeImage src={url} category={category} alt="gallery" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeGalleryImage(url)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-card/90 flex items-center justify-center"
                        aria-label="Remove"
                      >
                        <X className="h-3 w-3 text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {step === "Details" && (
          <>
            <div>
              <Label className="text-xs font-semibold">Product name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 80))}
                placeholder="e.g. Fresh tomatoes"
                className="mt-1 h-11"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="mt-1 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Unit / pack size</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value.slice(0, 32))}
                placeholder="e.g. 1 kg, 500 ml, 1 pc"
                className="mt-1 h-11"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 600))}
                placeholder="What is it, why is it special?"
                className="mt-1 min-h-[100px]"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{description.length}/600</p>
            </div>
          </>
        )}

        {step === "Pricing" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Selling price (₹)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">MRP (optional)</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0"
                  className="mt-1 h-11"
                />
              </div>
            </div>

            <PriceSuggestion
              category={category}
              currentPrice={Number(price) || 0}
              onApply={(p) => setPrice(String(p))}
            />

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Fair distribution</p>
              <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 mt-0.5 leading-relaxed">
                You set the price. The cooperative takes 6% to fund routing and the community fund. No platform markup.
              </p>
            </div>
          </>
        )}

        {step === "Review" && (
          <>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
              <SafeImage src={imageUrl} category={category} alt={name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{name}</p>
              <p className="text-[11px] text-muted-foreground">
                {category} · {unit}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-extrabold text-foreground">₹{price || 0}</span>
                {originalPrice && Number(originalPrice) > Number(price) && (
                  <span className="text-xs text-muted-foreground line-through">₹{originalPrice}</span>
                )}
              </div>
              <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">{description}</p>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 pt-2">
          {stepIdx > 0 && (
            <Button variant="outline" onClick={prev} className="h-11">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          {step !== "Review" ? (
            <Button
              className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              disabled={!canProceed}
              onClick={next}
            >
              Continue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              disabled={busy}
              onClick={submit}
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving…
                </>
              ) : (
                "Save product"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
