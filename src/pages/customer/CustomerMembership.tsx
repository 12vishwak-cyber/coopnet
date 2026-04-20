import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Heart, Vote, ShieldCheck, Sparkles, Users, Trophy,
  CheckCircle2, PiggyBank, Handshake, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMembership } from "@/contexts/MembershipContext";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

export default function CustomerMembership() {
  const navigate = useNavigate();
  const { joined, ordersCompleted, ordersRequired, progressPct, votingUnlocked, join } = useMembership();
  const [step, setStep] = useState<Step>(joined ? 4 : 1);

  const handleJoin = () => {
    join();
    toast.success("Welcome to the cooperative 🎉");
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card px-4 py-3 flex items-center gap-3 border-b border-border sticky top-0 z-10">
        <button
          onClick={() => (step > 1 && !joined ? setStep((s) => (s - 1) as Step) : navigate(-1))}
          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-[15px] font-bold text-foreground">Cooperative Membership</p>
          <p className="text-[10px] text-muted-foreground">Step {step} of 4</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={`h-1.5 w-5 rounded-full transition-colors ${
                n <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-28">
        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-6 text-primary-foreground shadow-lg">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                <Handshake className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-extrabold leading-tight">A network you can own.</h1>
              <p className="text-sm text-white/90 mt-2 leading-relaxed">
                CoopNet isn't owned by a company — it's owned by the people who use it.
                Sellers, workers, and customers share the rules and the rewards.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
              <h2 className="text-base font-extrabold text-foreground">What is a co-op?</h2>
              {[
                { icon: ShieldCheck, title: "Transparent rules", desc: "Every fee, split, and routing rule is visible." },
                { icon: Users, title: "Collective ownership", desc: "Members shape policy, not shareholders." },
                { icon: PiggyBank, title: "Shared community fund", desc: "A small slice of every order funds the network." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-3xl p-6 border border-border">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">Why it's worth it</h2>
              <p className="text-sm text-muted-foreground mt-1">Real benefits, not loyalty points.</p>
            </div>

            {[
              { icon: Vote, color: "bg-blue-100 dark:bg-blue-500/20 text-blue-600", title: "Vote on rules", desc: "Set delivery fees, fund %, and routing logic with the community." },
              { icon: PiggyBank, color: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600", title: "Member-only offers", desc: "Cooperative-funded discounts on everyday essentials." },
              { icon: Heart, color: "bg-rose-100 dark:bg-rose-500/20 text-rose-600", title: "Direct impact reports", desc: "See exactly which sellers and workers your orders supported." },
              { icon: Trophy, color: "bg-amber-100 dark:bg-amber-500/20 text-amber-600", title: "Priority dispute support", desc: "A people's committee reviews issues — not a chatbot." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl p-4 border border-border flex items-start gap-3">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-card rounded-3xl p-6 border border-border">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-extrabold text-foreground">Voting rights, earned by participation</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You unlock voting power as you shop. The more you participate, the more your voice counts.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">Your progress</span>
                <span className="text-xs font-bold text-primary">
                  {Math.min(ordersCompleted, ordersRequired)}/{ordersRequired} orders
                </span>
              </div>
              <Progress value={progressPct} className="h-2.5 mb-3" />
              <p className="text-xs text-muted-foreground">
                {ordersCompleted >= ordersRequired
                  ? "🎉 You've earned voting rights. Join to activate them."
                  : `${ordersRequired - ordersCompleted} more order${ordersRequired - ordersCompleted === 1 ? "" : "s"} to unlock voting power.`}
              </p>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
              <h3 className="text-sm font-extrabold text-foreground">How votes work</h3>
              {[
                "1 member = 1 vote, no exceptions",
                "Proposals open for 7 days",
                "60% threshold to pass",
                "All votes recorded on the public ledger",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs text-foreground">{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-up">
            {joined ? (
              <>
                <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-6 text-primary-foreground text-center shadow-lg">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold">You're a member 🎉</h2>
                  <p className="text-sm text-white/90 mt-1">
                    Welcome to the cooperative. Your voice is part of CoopNet now.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-foreground">Voting power</span>
                    {votingUnlocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" /> LOCKED
                      </span>
                    )}
                  </div>
                  <Progress value={progressPct} className="h-2.5 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {votingUnlocked
                      ? "You can vote on open proposals."
                      : `${Math.max(0, ordersRequired - ordersCompleted)} more order${
                          ordersRequired - ordersCompleted === 1 ? "" : "s"
                        } to activate voting.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/customer/network")}
                    className="bg-card rounded-2xl p-4 border border-border text-left active:scale-95 transition-transform"
                  >
                    <Heart className="h-5 w-5 text-rose-500 mb-2" />
                    <p className="text-sm font-bold text-foreground">See impact</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Your contribution so far</p>
                  </button>
                  <button
                    onClick={() => navigate("/customer")}
                    className="bg-card rounded-2xl p-4 border border-border text-left active:scale-95 transition-transform"
                  >
                    <Sparkles className="h-5 w-5 text-amber-500 mb-2" />
                    <p className="text-sm font-bold text-foreground">Keep shopping</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Earn more voting power</p>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-card rounded-3xl p-6 border border-border text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Handshake className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground">Ready to join?</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Membership is free. You can leave anytime. No subscriptions, no hidden terms.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
                  <h3 className="text-sm font-extrabold text-foreground">Member commitments</h3>
                  {[
                    "Treat sellers and workers fairly",
                    "Use governance tools in good faith",
                    "Help review disputes when asked",
                  ].map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-xs text-foreground">{c}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex gap-2">
        {!joined && step < 4 && (
          <Button
            className="flex-1 h-12 rounded-2xl font-bold"
            onClick={() => setStep((s) => (s + 1) as Step)}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {!joined && step === 4 && (
          <Button className="flex-1 h-12 rounded-2xl font-bold" onClick={handleJoin}>
            Join the cooperative
          </Button>
        )}
        {joined && (
          <Button
            className="flex-1 h-12 rounded-2xl font-bold"
            variant="outline"
            onClick={() => navigate("/customer")}
          >
            Back to shopping
          </Button>
        )}
      </div>
    </div>
  );
}
