import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { id: string; from: "customer" | "seller"; text: string; at: number };

const STARTER: Msg[] = [
  { id: "s1", from: "seller", text: "Hi! How can I help with your order today?", at: Date.now() - 60_000 },
];

const STORAGE = (sellerId: string) => `coopnet:chat:${sellerId}`;

function autoReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("price")) return "Prices on the page are final — no extra markup at checkout.";
  if (t.includes("stock") || t.includes("available")) return "All items shown are in stock and ready to dispatch.";
  if (t.includes("deliver") || t.includes("time")) return "We pack within 5–8 minutes; delivery is 10–15 mins from your area.";
  if (t.includes("fresh")) return "All produce is sourced this morning from the local mandi.";
  return "Thanks for reaching out — I'll confirm and get back in a minute.";
}

export default function SellerChat({ sellerId, sellerName }: { sellerId: string; sellerName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return STARTER;
    try {
      const raw = window.localStorage.getItem(STORAGE(sellerId));
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : STARTER;
    } catch {
      return STARTER;
    }
  });
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE(sellerId), JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages, sellerId]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const mine: Msg = { id: `m${Date.now()}`, from: "customer", text, at: Date.now() };
    setMessages((m) => [...m, mine]);
    setDraft("");
    // Simulated seller reply.
    setTimeout(() => {
      const reply: Msg = {
        id: `m${Date.now() + 1}`,
        from: "seller",
        text: autoReply(text),
        at: Date.now(),
      };
      setMessages((m) => [...m, reply]);
    }, 900);
  };

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1 hover:bg-emerald-500/15 transition-colors"
      >
        <MessageCircle className="h-3 w-3" /> Chat with seller
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border shadow-xl flex flex-col max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                  {sellerName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{sellerName}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  Usually replies in a few minutes
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"
                aria-label="Close chat"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface">
              {messages.map((m) => {
                const mine = m.from === "customer";
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
                        mine
                          ? "bg-emerald-500 text-white rounded-br-sm"
                          : "bg-card border border-border text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p>{m.text}</p>
                      <p
                        className={`text-[9px] mt-1 ${
                          mine ? "text-white/70" : "text-muted-foreground"
                        }`}
                      >
                        {fmtTime(m.at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-border bg-card flex items-center gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Type a message…"
                className="h-11 rounded-xl"
              />
              <Button
                onClick={send}
                disabled={!draft.trim()}
                className="h-11 w-11 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600"
                aria-label="Send"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
