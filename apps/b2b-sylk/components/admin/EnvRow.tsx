"use client";

import { useState } from "react";
import type { EnvVarDefinition } from "@workspace/tenant-ui";
import { Eye, EyeOff, CheckCircle2, AlertTriangle, Copy } from "lucide-react";

interface EnvRowProps {
  varDef: EnvVarDefinition;
  isSet: boolean;
}

export function EnvRow({ varDef, isSet }: EnvRowProps) {
  const [localValue, setLocalValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveLocal = () => {
    if (localValue.trim()) {
      sessionStorage.setItem(`env_${varDef.key}`, localValue.trim());
      // Show confirmation
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(varDef.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`bg-[#0f1629] border rounded-xl p-4 transition-colors ${
        isSet ? "border-white/5" : "border-orange-500/15"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-4 h-4 shrink-0 ${isSet ? "text-emerald-400" : "text-orange-400"}`}
        >
          {isSet ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <button
              onClick={handleCopyKey}
              className="font-mono text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
            >
              {varDef.key}
              <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <span
              className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase ${
                varDef.isPublic ? "bg-blue-500/10 text-blue-500" : "bg-slate-500/10 text-slate-500"
              }`}
            >
              {varDef.isPublic ? "Public" : "Privé"}
            </span>
            <span className="text-[9px] text-slate-600 font-medium">{varDef.module}</span>
          </div>

          <p className="text-xs text-slate-500 mb-2">{varDef.description}</p>
          <p className="text-[10px] font-mono text-slate-700">Ex: {varDef.example}</p>

          {!isSet && (
            <div className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showValue ? "text" : "password"}
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                  placeholder="Valeur locale (session uniquement)"
                  className="w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-blue-500/40 pr-8"
                />
                <button
                  onClick={() => setShowValue(!showValue)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                >
                  {showValue ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
              <button
                onClick={handleSaveLocal}
                disabled={!localValue.trim()}
                className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {copied ? "✓ Enregistré" : "Session locale"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
