"use client";

import { createContext, useContext } from "react";

export interface TestimonialItem {
  quote: string;
  author: string;
  title: string;
  initial: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  logo: string;
  contact: {
    email: string;
  };
  colors: {
    bg: string;
    bgAlt: string;
    bgGradientFrom: string;
    bgGradientVia: string;
    bgGradientTo: string;
    glow: string;
    textMuted: string;
    textAccent: string;
    border: string;
    cardBg: string;
  };
  socialProof: {
    linkedinCount: string;
    partnersCount: string;
    industriesCount: string;
    badgeText: string;
    ratingText: string;
  };
  hero: {
    image: string;
    headline: string;
    headlineAccent: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
  };
  testimonials: {
    heading: string;
    description: string;
    items: TestimonialItem[];
  };
  funnel: {
    image: string;
    tenantId: string;
    steps: FunnelStep[];
    content: FunnelContent;
  };
  funnelHomeEnabled: boolean;
  calendlyUrl: string;
  dailyRoomUrl: string;
  linkedinUrl: string;
  slides?: Slide[];
  legal?: {
    capital?: string;
    rcs?: string;
    siret?: string;
    naf?: string;
    orias?: string;
    carteTpi?: string;
    rcp?: string;
    phone?: string;
  };
}

export interface FunnelStep {
  id: string;
  title: string;
  options: FunnelOption[];
}

export interface FunnelContent {
  landingTitle: string;
  landingSubtitle: string;
  landingQuote: string;
  landingQuoteAuthor: string;
  landingCta: string;
  stepPrefix: string;
  questionIntro: string;
  qualifiedTitle: string;
  qualifiedMessage: string;
  qualifiedCta: string;
  disqualifiedTitle: string;
  disqualifiedMessage: string;
  loadingText: string;
  showInlineCalendar: boolean;
}

export interface FunnelOption {
  id: string;
  label: string;
  value: string;
  nextStepId?: string | null;
}

export interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  accent: string;
  icon: string;
}

const TenantContext = createContext<TenantConfig | null>(null);

export const TenantProvider = TenantContext.Provider;

export function useTenant(): TenantConfig {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return ctx;
}
