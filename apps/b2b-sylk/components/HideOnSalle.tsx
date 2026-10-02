"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function getHostname() {
  return typeof window !== "undefined" ? window.location.hostname : "";
}

function subscribe() {
  return () => {};
}

export default function HideOnSalle({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hostname = useSyncExternalStore(subscribe, getHostname, () => "");

  if (
    pathname.startsWith("/reunion") ||
    pathname.startsWith("/salle-de-vente") ||
    pathname.startsWith("/funnel") ||
    hostname.startsWith("reunion") ||
    hostname.startsWith("planification")
  )
    return null;
  return <>{children}</>;
}
