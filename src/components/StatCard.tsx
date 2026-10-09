import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  const changeColor = changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="min-w-0 bg-card rounded-lg border p-3 md:p-5 card-hover">
      <div className="flex items-start justify-between gap-1 mb-1 md:mb-3">
        <span className="text-xs md:text-[13px] text-muted-foreground font-medium">{title}</span>
        <div className="h-5 w-5 md:h-8 md:w-8 shrink-0 rounded-lg md:bg-accent flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent-foreground" />
        </div>
      </div>
      <div className="text-xl md:text-2xl font-semibold tabular-nums">{value}</div>
      {change && <p className={`text-[11px] mt-1 md:mt-1.5 ${changeColor}`}>{change}</p>}
    </div>
  );
}
