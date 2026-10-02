"use client";

import { TenantProvider, type TenantConfig } from "../tenant-config";

export function TenantRoot({
  config,
  children,
}: {
  config: TenantConfig;
  children: React.ReactNode;
}) {
  return <TenantProvider value={config}>{children}</TenantProvider>;
}
