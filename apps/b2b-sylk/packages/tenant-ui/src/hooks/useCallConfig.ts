"use client";

import { useState, useEffect } from "react";

export interface CallConfigCategory {
  key: string;
  label: string;
  type: "select" | "textarea" | "toggle";
  options: string[];
  script: string;
  clientLabel: string;
  clientPlaceholder: string;
  required: boolean;
}

export interface CallConfigBranding {
  cabinetName: string;
  logo: string;
  calendlyUrl: string;
  calUrl?: string;
}

export interface CallConfigPhase {
  label: string;
  duration: number;
  description: string;
  categories?: CallConfigCategory[];
  steps?: string[];
  screenClient: Record<string, unknown>;
}

export interface CallConfigQualificationStep {
  id: string;
  title: string;
  options: { id: string; label: string; value: string }[];
}

export interface CallConfig {
  branding: CallConfigBranding;
  phases: string[];
  r1: CallConfigPhase;
  r2: CallConfigPhase;
  r3: CallConfigPhase;
  qualification: {
    steps: CallConfigQualificationStep[];
  };
}

export function useCallConfig(tenantId: string) {
  const [config, setConfig] = useState<CallConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/call-config?tenant_id=${tenantId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setConfig(data.config);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load config");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  return { config, loading, error };
}
