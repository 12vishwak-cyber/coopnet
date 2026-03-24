import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";

const settings = [
  { label: "Order Notifications", desc: "Receive alerts for new orders and assignments", default: true },
  { label: "Delivery Updates", desc: "Get status updates on active deliveries", default: true },
  { label: "Network Alerts", desc: "Alerts for rule changes and fund updates", default: false },
];

const routingModes = [
  { label: "Auto (Network Optimized)", active: true },
  { label: "Manual Override", active: false },
];

const dataSettings = [
  { label: "Show contribution in earnings", default: true },
  { label: "Display network rank", default: true },
  { label: "Show fund balance", default: false },
];

export default function SettingsPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" description="System preferences" />

      <div className="space-y-4">
        <div className="bg-card border rounded-lg p-5 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-1">
          <h3 className="text-sm font-medium mb-4">Notifications</h3>
          <div className="space-y-4">
            {settings.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                </div>
                <Switch defaultChecked={s.default} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-2">
          <h3 className="text-sm font-medium mb-4">Routing Mode</h3>
          <div className="space-y-3">
            {routingModes.map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-sm">{m.label}</span>
                <Switch defaultChecked={m.active} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-5 animate-fade-up stagger-3">
          <h3 className="text-sm font-medium mb-4">Data Visibility</h3>
          <div className="space-y-3">
            {dataSettings.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <span className="text-sm">{d.label}</span>
                <Switch defaultChecked={d.default} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-4 animate-fade-up">
        Preferences stored locally · Rules applied by cooperative
      </p>
    </div>
  );
}
