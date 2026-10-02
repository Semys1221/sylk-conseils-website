import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/analytics-sidebar";
import { PostHogProvider } from "@/providers/PostHogProvider";
import SuspendedPostHogPageView from "@/components/dashboard/atomes/PostHogPageView";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <TooltipProvider>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-12 items-center gap-2 border-b border-border px-4">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground">Analytics</span>
            </header>
            <SuspendedPostHogPageView />
            <div className="flex-1">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </PostHogProvider>
  );
}
