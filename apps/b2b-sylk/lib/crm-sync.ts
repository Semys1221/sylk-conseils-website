import type { CRMSyncResult } from "@workspace/shared-types";

export async function syncCRMData(tenantId: string): Promise<CRMSyncResult> {
  void tenantId;
  return {
    synced: 0,
    interested: 0,
    website_visits: 0,
    booked_calls: 0,
    last_sync: new Date().toISOString(),
  };
}
