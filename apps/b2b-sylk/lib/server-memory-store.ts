/** In-process store for tenant data previously persisted in Supabase. */

const tenantConfigs = new Map<string, Record<string, unknown>>();
const callConfigs = new Map<string, Record<string, unknown>>();

export function getTenantConfig(tenantId: string): Record<string, unknown> | undefined {
  return tenantConfigs.get(tenantId);
}

export function setTenantConfig(tenantId: string, config: Record<string, unknown>): void {
  tenantConfigs.set(tenantId, config);
}

export function getCallConfig(tenantId: string): Record<string, unknown> | null | undefined {
  return callConfigs.get(tenantId);
}

export function setCallConfig(tenantId: string, config: Record<string, unknown>): void {
  callConfigs.set(tenantId, config);
}
