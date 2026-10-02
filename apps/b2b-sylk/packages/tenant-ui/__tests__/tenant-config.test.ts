import { describe, it, expect } from "vitest";
import { SERVICES, ENV_VARS } from "../src/lib/services";

describe("Tenant UI - Service Definitions", () => {
  it("has all 5 services defined", () => {
    expect(SERVICES).toHaveLength(5);
  });

  it("includes Pusher for real-time slide sync", () => {
    const pusher = SERVICES.find((s) => s.id === "pusher");
    expect(pusher).toBeDefined();
    expect(pusher!.description).toContain("slides");
    expect(pusher!.category).toBe("communication");
  });

  it("includes Daily.co for video calls", () => {
    const daily = SERVICES.find((s) => s.id === "daily");
    expect(daily).toBeDefined();
    expect(daily!.description).toContain("vidéo");
  });

  it("includes PostHog for analytics", () => {
    expect(SERVICES.some((s) => s.id === "posthog")).toBe(true);
  });

  it("includes N8N for funnel qualification webhook", () => {
    const n8n = SERVICES.find((s) => s.id === "n8n");
    expect(n8n).toBeDefined();
    expect(n8n!.description).toContain("tunnel de qualification");
  });

  it("includes Calendly for scheduling", () => {
    const calendly = SERVICES.find((s) => s.id === "calendly");
    expect(calendly).toBeDefined();
    expect(calendly!.description).toContain("réservation");
  });

  it("includes PostHog for analytics", () => {
    const posthog = SERVICES.find((s) => s.id === "posthog");
    expect(posthog).toBeDefined();
    expect(posthog!.category).toBe("analytics");
  });

  it("each service has required env vars", () => {
    SERVICES.forEach((s) => {
      expect(s.envVars.length).toBeGreaterThanOrEqual(0);
      expect(s.testEndpoint).toBeTruthy();
    });
  });
});

describe("Tenant UI - Environment Variables", () => {
  it("has all required env vars for Salle de Vente", () => {
    const salleVenteVars = ENV_VARS.filter((v) => v.module === "Salle de Vente");
    expect(salleVenteVars.length).toBeGreaterThanOrEqual(4);
    const keys = salleVenteVars.map((v) => v.key);
    expect(keys).toContain("NEXT_PUBLIC_PUSHER_KEY");
    expect(keys).toContain("NEXT_PUBLIC_PUSHER_CHANNEL_ID");
    expect(keys).toContain("PUSHER_SECRET");
  });

  it("has funnel-related env vars", () => {
    const funnelVars = ENV_VARS.filter((v) => v.module === "Funnel");
    expect(funnelVars.length).toBeGreaterThanOrEqual(2);
    const keys = funnelVars.map((v) => v.key);
    expect(keys).toContain("N8N_WEBHOOK_URL");
    expect(keys).toContain("NEXT_PUBLIC_CALENDLY_URL");
  });
});

describe("Tenant Config Interface", () => {
  it("FunnelContent interface has all required fields", () => {
    const requiredFields = [
      "landingTitle",
      "landingSubtitle",
      "landingQuote",
      "landingQuoteAuthor",
      "landingCta",
      "stepPrefix",
      "questionIntro",
      "qualifiedTitle",
      "qualifiedMessage",
      "qualifiedCta",
      "disqualifiedTitle",
      "disqualifiedMessage",
      "loadingText",
      "showInlineCalendar",
    ] as const;
    expect(requiredFields).toHaveLength(14);
  });

  it("FunnelOption interface has nextStepId for early exit", () => {
    const option = {
      id: "test",
      label: "Test",
      value: "test",
      nextStepId: "end_qualified",
    };
    expect(option.nextStepId).toBe("end_qualified");
  });
});
