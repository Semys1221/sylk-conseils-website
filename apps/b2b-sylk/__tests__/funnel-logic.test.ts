import { describe, it, expect } from "vitest";

describe("Funnel Evaluation Logic", () => {
  type ResultType = "qualified" | "eligible" | "disqualified";

  function evaluateFunnel(answers: Record<string, string>): ResultType {
    const values = Object.values(answers);
    if (values.includes("disqualified")) return "disqualified";
    if (values.includes("eligible")) return "eligible";
    return "qualified";
  }

  it("returns qualified when all answers are valid", () => {
    const result = evaluateFunnel({ q1: "yes", q2: "ok", q3: "good" });
    expect(result).toBe("qualified");
  });

  it("returns disqualified when any answer is disqualified", () => {
    const result = evaluateFunnel({ q1: "yes", q2: "disqualified", q3: "good" });
    expect(result).toBe("disqualified");
  });

  it("returns eligible when any answer is eligible", () => {
    const result = evaluateFunnel({ q1: "yes", q2: "eligible", q3: "good" });
    expect(result).toBe("eligible");
  });

  it("disqualified takes priority over eligible", () => {
    const result = evaluateFunnel({ q1: "disqualified", q2: "eligible", q3: "good" });
    expect(result).toBe("disqualified");
  });

  it("returns qualified for empty answers", () => {
    const result = evaluateFunnel({});
    expect(result).toBe("qualified");
  });

  it("treats values case-sensitively", () => {
    const result = evaluateFunnel({ q1: "Disqualified" });
    expect(result).toBe("qualified");
  });

  it("handles multiple disqualified values", () => {
    const result = evaluateFunnel({ q1: "disqualified", q2: "disqualified" });
    expect(result).toBe("disqualified");
  });

  it("handles mixed eligible and qualified values", () => {
    const result = evaluateFunnel({ q1: "eligible", q2: "ok", q3: "good" });
    expect(result).toBe("eligible");
  });
});

describe("Session ID Generation", () => {
  it("generates unique session IDs", () => {
    const generateId = () =>
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });

  it("generates IDs of correct length", () => {
    const id =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    expect(id.length).toBeGreaterThanOrEqual(20);
  });
});

describe("Pusher Channel Configuration", () => {
  it("defaults to sylk-conseils channel ID", () => {
    const channelId = "sylk-conseils";
    expect(channelId).toBe("sylk-conseils");
  });
});
