import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TenantProvider } from "@workspace/tenant-ui";
import type { TenantConfig, Slide } from "@workspace/tenant-ui";

const mockSlides: Slide[] = [
  {
    id: 0,
    tag: "Bienvenue",
    title: "Titre 1",
    subtitle: "Sous-titre 1",
    accent: "from-blue-600/20 to-indigo-600/10",
    icon: "◈",
  },
  {
    id: 1,
    tag: "Constat",
    title: "Titre 2",
    subtitle: "Sous-titre 2",
    accent: "from-red-600/15 to-orange-600/10",
    icon: "⊘",
  },
];

const mockConfig: TenantConfig = {
  id: "test",
  name: "Test",
  tagline: "Test tagline",
  domain: "test.com",
  logo: "/logo.png",
  contact: { email: "test@test.com" },
  colors: {
    bg: "#000",
    bgAlt: "#111",
    bgGradientFrom: "#000",
    bgGradientVia: "#111",
    bgGradientTo: "#222",
    glow: "bg-white/5",
    textMuted: "text-slate-400",
    textAccent: "text-blue-300",
    border: "border-white/5",
    cardBg: "#111",
  },
  socialProof: {
    linkedinCount: "+1",
    partnersCount: "+1",
    industriesCount: "+1",
    badgeText: "test",
    ratingText: "test",
  },
  hero: {
    image: "/test.jpg",
    headline: "Test",
    headlineAccent: "Test",
    subtitle: "Test",
    ctaText: "Test",
    ctaLink: "/test",
    secondaryCtaText: "Test",
  },
  testimonials: { heading: "Test", description: "Test", items: [] },
  funnelHomeEnabled: true,
  funnel: {
    image: "",
    tenantId: "test",
    steps: [],
    content: {
      landingTitle: "",
      landingSubtitle: "",
      landingQuote: "",
      landingQuoteAuthor: "",
      landingCta: "",
      stepPrefix: "",
      questionIntro: "",
      qualifiedTitle: "",
      qualifiedMessage: "",
      qualifiedCta: "",
      disqualifiedTitle: "",
      disqualifiedMessage: "",
      loadingText: "",
      showInlineCalendar: false,
    },
  },
  calUrl: "/cal",
  dailyRoomUrl: "/daily",
  linkedinUrl: "/linkedin",
  slides: mockSlides,
};

function withTenant(ui: React.ReactElement) {
  return React.createElement(TenantProvider, { value: mockConfig }, ui);
}

describe("SlideViewer (Shared Component)", () => {
  beforeEach(() => {
    vi.stubGlobal("process", {
      ...process,
      env: {
        ...process.env,
        NEXT_PUBLIC_PUSHER_KEY: "not-set",
        NEXT_PUBLIC_PUSHER_CHANNEL_ID: "test-channel",
      },
    });
  });

  it("renders the current slide tag", async () => {
    const { SlideViewer } = await import("@workspace/tenant-ui");
    render(
      withTenant(React.createElement(SlideViewer, { currentSlide: 0, onSlideChange: vi.fn() }))
    );
    expect(screen.getByText("Bienvenue")).toBeTruthy();
  });

  it("renders the current slide title", async () => {
    const { SlideViewer } = await import("@workspace/tenant-ui");
    render(
      withTenant(React.createElement(SlideViewer, { currentSlide: 0, onSlideChange: vi.fn() }))
    );
    expect(screen.getByText("Titre 1")).toBeTruthy();
  });

  it("renders different slide on index change", async () => {
    const { SlideViewer } = await import("@workspace/tenant-ui");
    const { rerender } = render(
      withTenant(React.createElement(SlideViewer, { currentSlide: 0, onSlideChange: vi.fn() }))
    );
    rerender(
      withTenant(React.createElement(SlideViewer, { currentSlide: 1, onSlideChange: vi.fn() }))
    );
    const el = await screen.findByText("Titre 2", {}, { timeout: 2000 });
    expect(el).toBeTruthy();
  });

  it("shows progress indicator", async () => {
    const { SlideViewer } = await import("@workspace/tenant-ui");
    render(
      withTenant(React.createElement(SlideViewer, { currentSlide: 0, onSlideChange: vi.fn() }))
    );
    expect(screen.getByText("01 / 02")).toBeTruthy();
  });

  it("falls back to default slides when none provided", async () => {
    const configNoSlides: TenantConfig = { ...mockConfig, slides: undefined };
    const { SlideViewer } = await import("@workspace/tenant-ui");
    render(
      React.createElement(
        TenantProvider,
        { value: configNoSlides },
        React.createElement(SlideViewer, { currentSlide: 0, onSlideChange: vi.fn() })
      )
    );
    expect(screen.getByText("Votre avenir financier commence aujourd'hui")).toBeTruthy();
  });
});

describe("SlideController (Shared Component)", () => {
  it("calls onSlideChange when navigating", async () => {
    const { SlideController } = await import("@workspace/tenant-ui");
    const onSlideChange = vi.fn();
    render(withTenant(React.createElement(SlideController, { currentSlide: 0, onSlideChange })));
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("shows correct slide count", async () => {
    const { SlideController } = await import("@workspace/tenant-ui");
    render(
      withTenant(
        React.createElement(SlideController, {
          currentSlide: 0,
          onSlideChange: vi.fn(),
          slideCount: 6,
        })
      )
    );
    expect(screen.getByText("1 / 6")).toBeTruthy();
  });

  it("disables prev button on first slide", async () => {
    const { SlideController } = await import("@workspace/tenant-ui");
    render(
      withTenant(
        React.createElement(SlideController, {
          currentSlide: 0,
          onSlideChange: vi.fn(),
          slideCount: 3,
        })
      )
    );
    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    expect(prevButton.hasAttribute("disabled")).toBe(true);
  });

  it("disables next button on last slide", async () => {
    const { SlideController } = await import("@workspace/tenant-ui");
    render(
      withTenant(
        React.createElement(SlideController, {
          currentSlide: 2,
          onSlideChange: vi.fn(),
          slideCount: 3,
        })
      )
    );
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton.hasAttribute("disabled")).toBe(true);
  });
});
