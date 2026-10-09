import { Link } from "react-router-dom";
import { networkItems } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

const priority = ["Voting", "Ledger", "Fund"];
const shortcuts = [...networkItems].sort((a, b) => {
  const rank = (title: string) => {
    const index = priority.indexOf(title);
    return index < 0 ? priority.length : index;
  };
  return rank(a.title) - rank(b.title);
});

export function MobileNetworkShortcuts() {
  return (
    <section aria-label="Cooperative network" className="space-y-2">
      <h2 className="text-sm font-bold">Your cooperative</h2>
      <div className="grid grid-cols-3 gap-2">
        {shortcuts.map(({ title, url, icon: Icon }) => (
          <Button key={url} variant="outline" asChild className="h-11 min-w-0 gap-1.5 px-2 text-xs">
            <Link to={url}>
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}