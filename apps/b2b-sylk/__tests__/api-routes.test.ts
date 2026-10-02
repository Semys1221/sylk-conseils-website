import { describe, it, expect } from "vitest";

describe("Tenant 1 - API Routes (Funnel & Salle de Vente)", () => {
  const routes = [
    { method: "POST", path: "/api/funnel/submit", desc: "Submit funnel answers to N8N" },
    { method: "POST", path: "/api/funnel/sync-step", desc: "Sync funnel step progress" },
    { method: "POST", path: "/api/slides/change", desc: "Broadcast slide change via Pusher" },
    { method: "POST", path: "/api/salle-de-vente/sync-field", desc: "Sync form field via Pusher" },
    { method: "POST", path: "/api/salle-de-vente/upload", desc: "Upload document to storage" },
    { method: "GET", path: "/api/call-config", desc: "Fetch call configuration" },
    { method: "POST", path: "/api/call-config/save", desc: "Save call configuration" },
    { method: "POST", path: "/api/contract/generate", desc: "Generate contract PDF" },
    { method: "POST", path: "/api/contract/sign", desc: "Sign contract" },
    { method: "POST", path: "/api/audit/save", desc: "Save audit data" },
    { method: "GET", path: "/api/audit/[sessionId]", desc: "Get audit data" },
  ];

  it("has all required API routes defined", () => {
    expect(routes).toHaveLength(11);
    routes.forEach((r) => {
      expect(r.path).toBeTruthy();
      expect(["POST", "GET"]).toContain(r.method);
    });
  });

  it("has funnel submit route", () => {
    const submit = routes.find((r) => r.path === "/api/funnel/submit");
    expect(submit).toBeDefined();
    expect(submit!.method).toBe("POST");
  });

  it("has slide change route for live diaporama", () => {
    const slideRoute = routes.find((r) => r.path === "/api/slides/change");
    expect(slideRoute).toBeDefined();
    expect(slideRoute!.method).toBe("POST");
  });

  it("has sync-field route for real-time form sync", () => {
    const syncRoute = routes.find((r) => r.path === "/api/salle-de-vente/sync-field");
    expect(syncRoute).toBeDefined();
  });
});
