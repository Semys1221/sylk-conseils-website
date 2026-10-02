"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState } from "react";
import type { PostHog } from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";

    if (!key || key === "phc_not-set" || key.includes("phc_not")) return;

    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: false,
      });
      setClient(posthog);
    });
  }, []);

  if (!client) return <>{children}</>;

  return <PHProvider client={client}>{children}</PHProvider>;
}
