import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, Trash2, Check, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type DetectedItem = { name: string; qty?: string | null; price?: number | null };

export default function SellerBulkUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DetectedItem[]>([]);
  const [saving, setSaving] = useState(false);

  const onPick = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setItems([]);
  };

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1] ?? "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleParse = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const b64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("parse-product-image", {
        body: { imageBase64: b64, mimeType: file.type },
      });
      if (error) throw error;
      const detected: DetectedItem[] = data?.items ?? [];
      if (detected.length === 0) {
        toast.error("No items detected. Try a clearer photo.");
      } else {
        toast.success(`Detected ${detected.length} items`);
      }
      setItems(detected);
    } catch (e) {
      console.error(e);
      toast.error("Could not read the image");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (idx: number, patch: Partial<DetectedItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    if (items.length === 0) return;
    const valid = items.filter((i) => i.name?.trim() && (i.price ?? 0) > 0);
    if (valid.length === 0) {
      toast.error("Add a price (₹) for at least one item before saving");
      return;
    }
    setSaving(true);
    try {
      // Demo seller — first seller in DB
      const { data: sellers } = await supabase.from("sellers").select("id").limit(1);
      const sellerId = sellers?.[0]?.id ?? "seller-1";
      const products = valid.map((it, idx) => ({
        id: `bulk-${Date.now()}-${idx}`,
        name: it.name.trim(),
        unit: it.qty?.toString() ?? "1 pc",
        price: Number(it.price ?? 0),
        original_price: null,
        image: "/placeholder.svg",
        category: "Groceries",
        in_stock: true,
        gallery_images: [],
      }));
      const { error } = await supabase.functions.invoke("seller-add-products", {
        body: { sellerId, products },
      });
      if (error) throw error;
      toast.success(`${rows.length} products added`);
      navigate("/seller/inventory");
    } catch (e) {
      console.error(e);
      toast.error("Could not save products");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-muted-foreground flex items-center gap-1 mb-3 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <PageHeader
        title="Upload Product List"
        description="Snap a photo of a supplier bill or handwritten list — we'll convert it into products."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
        {/* Upload column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border rounded-xl p-5">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPick(f);
                }}
              />
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                {preview ? (
                  <img src={preview} alt="upload" className="max-h-56 mx-auto rounded-lg object-contain" />
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-semibold">Tap to choose photo</p>
                    <p className="text-xs text-muted-foreground mt-1">Bill, handwritten list, or shelf photo</p>
                  </>
                )}
              </div>
            </label>
            <Button
              onClick={handleParse}
              disabled={!file || loading}
              className="w-full mt-4 h-11 gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Reading…" : "Detect Products"}
            </Button>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              Works best with clear, well-lit photos
            </p>
          </div>
        </div>

        {/* Detected list */}
        <div className="lg:col-span-3 bg-card border rounded-xl">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold">Detected items {items.length > 0 && `(${items.length})`}</h2>
            <Button
              size="sm"
              onClick={handleSaveAll}
              disabled={items.length === 0 || saving}
              className="gap-1"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Save all
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-3 opacity-50" />
              Upload a photo and we'll list the products here for you to confirm.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((it, idx) => (
                <div key={idx} className="p-3 grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-5 h-9"
                    value={it.name}
                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                    placeholder="Product name"
                  />
                  <Input
                    className="col-span-3 h-9"
                    value={it.qty ?? ""}
                    onChange={(e) => updateItem(idx, { qty: e.target.value })}
                    placeholder="Qty / unit"
                  />
                  <Input
                    className="col-span-3 h-9"
                    type="number"
                    value={it.price ?? ""}
                    onChange={(e) =>
                      updateItem(idx, { price: e.target.value ? Number(e.target.value) : null })
                    }
                    placeholder="Price ₹"
                  />
                  <button
                    onClick={() => removeItem(idx)}
                    className="col-span-1 h-9 w-9 flex items-center justify-center rounded text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
