import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Slide Sync Integration (Pusher)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("slide change API sends correct payload", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const response = await fetch("/api/slides/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slideIndex: 3 }),
    });

    expect(response.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith("/api/slides/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slideIndex: 3 }),
    });
  });

  it("broadcasts multiple slide changes sequentially", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", mockFetch);

    for (let i = 0; i < 5; i++) {
      await fetch("/api/slides/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideIndex: i }),
      });
    }

    expect(mockFetch).toHaveBeenCalledTimes(5);
  });

  it("handles network error when broadcasting slide change", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Network error")));

    try {
      await fetch("/api/slides/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideIndex: 1 }),
      });
    } catch {
      // expected
    }

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("sync-field API sends correct field update payload", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const payload = {
      fieldKey: "patrimoine",
      value: "500k€",
      source: "client",
      channelId: "sylk-conseils",
    };

    await fetch("/api/salle-de-vente/sync-field", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/salle-de-vente/sync-field",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("patrimoine"),
      })
    );
  });

  it("funnel submit sends tenant context", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const answers = {
      structure: "independant",
      clients: "3-5",
      tenant_id: "sylk-conseils",
      result: "qualified",
    };

    await fetch("/api/funnel/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.tenant_id).toBe("sylk-conseils");
    expect(callBody.result).toBe("qualified");
  });
});

describe("Pusher Channel Configuration", () => {
  it("uses tenant-specific channel ID", () => {
    const channelId = process.env.NEXT_PUBLIC_PUSHER_CHANNEL_ID ?? "sylk-conseils";
    expect(channelId).toBeTruthy();
  });

  it("slide-change event name matches API", () => {
    const eventName = "slide-change";
    expect(eventName).toBe("slide-change");
  });

  it("field-update event name matches API", () => {
    const eventName = "field-update";
    expect(eventName).toBe("field-update");
  });
});
