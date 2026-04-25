import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Clock, Loader2, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupportTickets, SUPPORT_CATEGORIES, type SupportRole, type Priority } from "@/lib/support";

type Props = {
  role: SupportRole;
  actorLabel: string;
};

/**
 * Shared support sub-flow used in both seller and worker dashboards.
 * Step 1: list tickets · Step 2: new ticket form · Step 3: confirmation
 * Tickets persist to Lovable Cloud and update in realtime.
 */
export default function SupportPanel({ role, actorLabel }: Props) {
  const { tickets, loading, submit } = useSupportTickets(role, actorLabel);
  const [step, setStep] = useState<"list" | "form" | "submitted">("list");
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState(SUPPORT_CATEGORIES[role][0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [orderRef, setOrderRef] = useState("");

  const reset = () => {
    setSubject("");
    setMessage("");
    setOrderRef("");
    setPriority("normal");
    setCategory(SUPPORT_CATEGORIES[role][0]);
  };

  const onSubmit = async () => {
    setBusy(true);
    const ok = await submit({ category, subject, message, priority, orderRef });
    setBusy(false);
    if (ok) {
      reset();
      setStep("submitted");
    }
  };

  if (step === "submitted") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center animate-fade-up">
        <div className="h-14 w-14 rounded-full bg-emerald-500/15 mx-auto mb-3 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <p className="text-base font-bold text-foreground">Ticket submitted</p>
        <p className="text-xs text-muted-foreground mt-1">Our co-op support volunteers will respond shortly.</p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => setStep("list")}>
            View tickets
          </Button>
          <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setStep("form")}>
            New ticket
          </Button>
        </div>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3 animate-fade-up">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">New support ticket</h3>
          <button
            onClick={() => setStep("list")}
            className="text-[11px] font-semibold text-muted-foreground"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[11px] font-semibold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 mt-1 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORT_CATEGORIES[role].map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] font-semibold">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="h-10 mt-1 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low" className="text-xs">Low</SelectItem>
                <SelectItem value="normal" className="text-xs">Normal</SelectItem>
                <SelectItem value="high" className="text-xs">High</SelectItem>
                <SelectItem value="urgent" className="text-xs">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-[11px] font-semibold">Subject</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value.slice(0, 120))}
            placeholder="Brief summary"
            className="h-10 mt-1 text-sm"
          />
        </div>

        <div>
          <Label className="text-[11px] font-semibold">Order ref (optional)</Label>
          <Input
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value.slice(0, 32))}
            placeholder="ORD-1847"
            className="h-10 mt-1 text-sm"
          />
        </div>

        <div>
          <Label className="text-[11px] font-semibold">Describe the issue</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 1200))}
            placeholder="Share what happened, expected outcome, and any context."
            className="min-h-[100px] mt-1 text-sm"
          />
          <p className="text-[10px] text-muted-foreground mt-1">{message.length}/1200</p>
        </div>

        <Button
          onClick={onSubmit}
          disabled={busy || subject.trim().length < 5 || message.trim().length < 10}
          className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" /> Submit ticket
            </>
          )}
        </Button>
      </div>
    );
  }

  // list
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Your tickets</h3>
          <p className="text-[11px] text-muted-foreground">{tickets.length} on record</p>
        </div>
        <Button
          size="sm"
          onClick={() => setStep("form")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-9 rounded-xl"
        >
          + New ticket
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <AlertCircle className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground">No tickets yet</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Open one when you need help</p>
        </div>
      ) : (
        tickets.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{t.id.slice(0, 8)}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === "resolved"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : t.status === "in_progress"
                        ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {t.status === "in_progress" ? "In progress" : t.status === "resolved" ? "Resolved" : "Open"}
                  </span>
                  {t.priority !== "normal" && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                      {t.priority}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-foreground mt-1">{t.subject}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{t.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span>{t.category}</span>
              {t.order_ref && <span>· {t.order_ref}</span>}
              <span className="ml-auto flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(t.created_at).toLocaleDateString()}
              </span>
            </div>
            {t.response && (
              <div className="mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5">
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                  Co-op response
                </p>
                <p className="text-[12px] text-foreground mt-0.5 leading-relaxed">{t.response}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
