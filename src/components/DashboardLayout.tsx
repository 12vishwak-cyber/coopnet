import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from "react-router-dom";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isWorker = location.pathname.startsWith("/worker");
  const nodeLabel = isWorker ? "Worker-07" : "Seller-23";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3 shrink-0">
            <SidebarTrigger />
            <span className="text-sm font-semibold text-foreground tracking-tight">CoopNet</span>
            <div className="flex items-center gap-3 ml-auto text-[11px] text-muted-foreground">
              <span className="hidden lg:inline font-mono text-[10px]">Node: {nodeLabel}</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success inline-block animate-pulse" />
                Node connected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
                Network active
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-muted-foreground">
                48 nodes · 12 workers
              </span>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto no-scrollbar p-6">
            {children}
          </main>
          <footer className="h-8 flex items-center justify-center border-t bg-card px-4">
            <p className="text-[10px] text-muted-foreground">
              Network rules active · Ledger synced · Fund active · Routing active · No central owner
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
