import { describe, it, expect } from "vitest";
import config from "../tenant.config";

describe("Tenant 1 - Parcours Prospect CGP (SYLK Conseils) Funnel Config", () => {
  it("has correct tenant id", () => {
    expect(config.id).toBe("sylk-conseils");
  });

  it("has funnel enabled", () => {
    expect(config.funnelHomeEnabled).toBe(true);
  });

  it("has a daily room URL", () => {
    expect(config.dailyRoomUrl).toContain("daily.co");
  });

  it("has a calendly URL", () => {
    expect(config.calendlyUrl).toContain("calendly.com");
  });

  it("has funnel content with all required fields", () => {
    const c = config.funnel.content;
    expect(c.landingTitle).toBeTruthy();
    expect(c.landingSubtitle).toBeTruthy();
    expect(c.landingCta).toBeTruthy();
    expect(c.qualifiedTitle).toBeTruthy();
    expect(c.qualifiedMessage).toBeTruthy();
    expect(c.disqualifiedTitle).toBeTruthy();
    expect(c.disqualifiedMessage).toBeTruthy();
    expect(c.loadingText).toBeTruthy();
  });

  it("has correct step prefix", () => {
    expect(config.funnel.content.stepPrefix).toBe("Étape");
  });

  it("does not show inline calendar", () => {
    expect(config.funnel.content.showInlineCalendar).toBe(false);
  });

  it("has no steps defined in config (uses DB)", () => {
    expect(config.funnel.steps).toEqual([]);
  });

  it("has correct tenantId for DB lookup", () => {
    expect(config.funnel.tenantId).toBe("sylk-conseils");
  });
});
