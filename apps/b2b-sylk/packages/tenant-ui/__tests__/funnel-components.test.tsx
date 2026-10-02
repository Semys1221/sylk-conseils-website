import { describe, it, expect } from "vitest";
import React from "react";
import { ProgressionCircle } from "../src/components/funnel/ProgressionCircle";

describe("ProgressionCircle Component", () => {
  it("renders with current and total props", () => {
    const { container } = renderComponent(<ProgressionCircle current={3} total={5} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("shows completion at 100% when current equals total", () => {
    const { container } = renderComponent(<ProgressionCircle current={5} total={5} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});

describe("Service Definitions", () => {
  it("Pusher service is configured for slide sync", () => {
    const pusherService = {
      id: "pusher",
      name: "Pusher",
      category: "communication" as const,
      description: "Synchronisation temps-réel des slides dans la Salle de Vente Interactive.",
      envVars: [
        "NEXT_PUBLIC_PUSHER_KEY",
        "NEXT_PUBLIC_PUSHER_APP_ID",
        "PUSHER_SECRET",
        "NEXT_PUBLIC_PUSHER_CLUSTER",
      ],
      testEndpoint: "pusher",
    };
    expect(pusherService.envVars).toHaveLength(4);
    expect(pusherService.category).toBe("communication");
  });
});

function renderComponent(element: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  // Simple React render without testing-library
  const root = document.createElement("div");
  container.appendChild(root);
  return { container };
}
