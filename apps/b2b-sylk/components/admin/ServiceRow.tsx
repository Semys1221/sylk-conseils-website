"use client";

import { useState } from "react";
import type { ServiceDefinition } from "@workspace/tenant-ui";
import { ExternalLink, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

const CATEGORY_COLORS: Record<ServiceDefinition["category"], string> = {
  api: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  auth: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  storage: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  analytics: "bg-green-500/10 text-green-400 border-green-500/20",
  communication: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  scheduling: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const CATEGORY_LABELS: Record<ServiceDefinition["category"], string> = {
  api: "API",
  auth: "Auth",
  storage: "Stockage",
  analytics: "Analytics",
  communication: "Temps réel",
  scheduling: "Planning",
};

interface TestResult {
  ok: boolean;
  latency: number;
  message: string;
}

interface ServiceRowProps {
  service: ServiceDefinition;
  envStatus: Record<string, boolean>;
}

export function ServiceRow({ service, envStatus }: ServiceRowProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const missingVars = service.envVars.filter((key) => !envStatus[key]);
  const allVarsSet = missingVars.length === 0;

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/test-connection?service=${service.testEndpoint}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ ok: false, latency: 0, message: String(e) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-[#0f1629] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{service.name}</h3>
            <span
              className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[service.category]}`}
            >
              {CATEGORY_LABELS[service.category]}
            </span>
            {!allVarsSet && (
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {missingVars.length} var. manquante{missingVars.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">{service.description}</p>

          {/* Env vars */}
          <div className="flex flex-wrap gap-1.5">
            {service.envVars.map((key) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  envStatus[key]
                    ? "bg-emerald-500/8 text-emerald-400 border border-emerald-500/15"
                    : "bg-orange-500/8 text-orange-400 border border-orange-500/15"
                }`}
              >
                {envStatus[key] ? "✓" : "⚠"} {key}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {service.docsUrl && (
            <a
              href={service.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center text-slate-600 hover:text-slate-300 hover:border-white/10 transition-colors"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <button
            onClick={handleTest}
            disabled={testing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            {testing ? <Loader2 size={12} className="animate-spin" /> : null}
            {testing ? "Test…" : "Tester"}
          </button>
        </div>
      </div>

      {/* Test result */}
      {result && (
        <div
          className={`mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
            result.ok
              ? "bg-emerald-500/8 border border-emerald-500/15 text-emerald-400"
              : "bg-red-500/8 border border-red-500/15 text-red-400"
          }`}
        >
          {result.ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          <span>{result.message}</span>
          <span className="ml-auto flex items-center gap-1 text-slate-500">
            <Clock size={10} /> {result.latency}ms
          </span>
        </div>
      )}
    </div>
  );
}
