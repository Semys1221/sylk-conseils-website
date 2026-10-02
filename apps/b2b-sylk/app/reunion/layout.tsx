import { PostHogProvider } from "@/providers/PostHogProvider";
import SuspendedPostHogPageView from "@/components/dashboard/atomes/PostHogPageView";

export default function ReunionLayout({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  );
}
