import { useState } from "react";
import { LifeBuoy, Camera, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ISSUES = [
  { id: "not_delivered", label: "Not delivered" },
  { id: "wrong_item", label: "Wrong item" },
  { id: "damaged", label: "Damaged" },
  { id: "other", label: "Other" },
];

type Props = {
  orderRef?: string;
  variant?: "button" | "icon";
};

export default function DisputeButton({ orderRef, variant = "button" }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState<string>("not_delivered");
  const [note, setNote] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const subject = `Dispute: ${ISSUES.find((i) => i.id === issue)?.label ?? issue}`;
      const message = `${note || "(no extra notes)"} — photo attached: ${photoName ? "yes" : "no"}`;
      const { error } = await supabase.from("support_tickets").insert({
        role_context: "worker", // RLS allows seller/worker; using worker for driver/customer disputes routing
        actor_label: "Customer",
        category: issue,
        subject,
        message: message.length < 10 ? message + " — please review" : message,
        priority: issue === "not_delivered" ? "high" : "normal",
        status: "open",
        order_ref: orderRef ?? null,
      });
      if (error) throw error;
      setDone(true);
      toast.success("Dispute submitted");
    } catch (e) {
      console.error(e);
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          className="h-9 px-3 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5"
        >
          <LifeBuoy className="h-3.5 w-3.5" /> {t("need_help")}
        </button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full gap-2 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
        >
          <LifeBuoy className="h-4 w-4" /> {t("need_help")}
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-5 border border-border shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-extrabold">{t("need_help")}</h2>
              <button onClick={() => { setOpen(false); setDone(false); }} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm font-bold">Thanks! We'll resolve in 24–48 hrs.</p>
                <p className="text-xs text-muted-foreground mt-1">You'll get an update on this order.</p>
                <Button onClick={() => { setOpen(false); setDone(false); }} className="mt-5 w-full">
                  Close
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3">Select what went wrong</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {ISSUES.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setIssue(opt.id)}
                      className={`text-left text-xs font-bold p-3 rounded-lg border-2 ${
                        issue === opt.id ? "border-primary bg-accent" : "border-border"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note (optional)"
                  rows={3}
                  className="text-sm mb-3"
                />
                <label className="block mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
                  />
                  <span className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-border rounded-lg p-3 cursor-pointer hover:bg-muted">
                    <Camera className="h-4 w-4" />
                    {photoName ? `Attached: ${photoName}` : "Attach photo (optional)"}
                  </span>
                </label>
                <Button onClick={submit} disabled={submitting} className="w-full gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  We'll resolve in 24–48 hrs
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
