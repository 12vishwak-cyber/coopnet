import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" description="System preferences" />

      <div className="bg-card border rounded-lg p-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Appearance</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-4 animate-fade-up">
        Network rules active · Preferences stored locally
      </p>
    </div>
  );
}
