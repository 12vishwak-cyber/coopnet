import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Wifi } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3 shrink-0">
            <SidebarTrigger />
            <div className="flex flex-col mr-auto">
              <span className="text-sm font-medium text-foreground leading-tight">CoopNet Cooperative Network</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Shared delivery and intelligence network</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
                Network active
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                48 nodes
              </span>
              <span className="hidden md:flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                12 workers online
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
