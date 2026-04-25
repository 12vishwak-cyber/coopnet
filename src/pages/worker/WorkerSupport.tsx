import { PageHeader } from "@/components/PageHeader";
import SupportPanel from "@/components/SupportPanel";
import VotingPanel from "@/components/VotingPanel";
import { LifeBuoy, Vote } from "lucide-react";
import { useState } from "react";

const ACTING_WORKER_LABEL = "Worker-07";

export default function WorkerSupport() {
  const [tab, setTab] = useState<"support" | "voting">("support");

  return (
    <div>
      <PageHeader title="Support & Voting" description="Get help and shape co-op rules" />

      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4 max-w-sm">
        <button
          onClick={() => setTab("support")}
          className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
            tab === "support" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <LifeBuoy className="h-3.5 w-3.5" /> Support
        </button>
        <button
          onClick={() => setTab("voting")}
          className={`flex-1 text-xs py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
            tab === "voting" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <Vote className="h-3.5 w-3.5" /> Voting
        </button>
      </div>

      {tab === "support" ? (
        <SupportPanel role="worker" actorLabel={ACTING_WORKER_LABEL} />
      ) : (
        <VotingPanel role="worker" variant="full" />
      )}
    </div>
  );
}
