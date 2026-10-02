"use client";

import { useState, useEffect } from "react";
import type { CallConfig } from "@workspace/tenant-ui";

interface CallConfigEditorProps {
  tenantId: string;
}

type EditorState = "loading" | "editing" | "saving" | "saved" | "error";

export default function CallConfigEditor({ tenantId }: CallConfigEditorProps) {
  const [config, setConfig] = useState<CallConfig | null>(null);
  const [state, setState] = useState<EditorState>("loading");
  const [activeTab, setActiveTab] = useState<"branding" | "calls" | "visuals">("branding");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setState("loading");
        const res = await fetch(`/api/call-config?tenant_id=${tenantId}`);
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        } else {
          setConfig(null);
        }
        setState("editing");
      } catch {
        setState("error");
        setErrorMsg("Impossible de charger la configuration");
      }
    }
    void load();
  }, [tenantId]);

  const handleSave = async () => {
    if (!config) return;
    try {
      setState("saving");
      const res = await fetch("/api/call-config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, config }),
      });
      const data = await res.json();
      if (data.success) {
        setState("saved");
        setTimeout(() => setState("editing"), 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setState("error");
      setErrorMsg(e instanceof Error ? e.message : "Erreur lors de la sauvegarde");
    }
  };

  const updateBranding = (key: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      branding: { ...config.branding, [key]: value },
    });
  };

  const addCategory = (phase: "r1") => {
    if (!config) return;
    const phaseData = config[phase];
    const categories = phaseData.categories ?? [];
    setConfig({
      ...config,
      [phase]: {
        ...phaseData,
        categories: [
          ...categories,
          {
            key: `field_${Date.now()}`,
            label: "Nouveau champ",
            type: "select",
            options: ["Option 1", "Option 2"],
            script: "",
            clientLabel: "Nouveau champ",
            clientPlaceholder: "Sélectionnez...",
            required: false,
          },
        ],
      },
    });
  };

  const removeCategory = (phase: "r1", index: number) => {
    if (!config) return;
    const categories = config[phase].categories ?? [];
    setConfig({
      ...config,
      [phase]: {
        ...config[phase],
        categories: categories.filter((_, i) => i !== index),
      },
    });
  };

  const updateCategory = (phase: "r1", index: number, field: string, value: unknown) => {
    if (!config) return;
    const categories = [...(config[phase].categories ?? [])];
    categories[index] = { ...categories[index], [field]: value } as (typeof categories)[number];
    setConfig({
      ...config,
      [phase]: { ...config[phase], categories },
    });
  };

  if (state === "loading") {
    return (
      <div className="flex items-center gap-3 text-slate-400 py-8">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-sm">Chargement de la configuration...</span>
      </div>
    );
  }

  if (state === "error" && !config) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">
        {errorMsg}
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-slate-400">
        Aucune configuration trouvée. Créez-en une nouvelle.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {(["branding", "calls", "visuals"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
              activeTab === tab
                ? "bg-blue-500/15 text-blue-300 border border-blue-500/25"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "branding" && "Branding"}
            {tab === "calls" && "Appels R1/R2/R3"}
            {tab === "visuals" && "Visuels écran client"}
          </button>
        ))}
      </div>

      {/* Branding Tab */}
      {activeTab === "branding" && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5 block">
              Nom du cabinet
            </label>
            <input
              type="text"
              value={config.branding.cabinetName}
              onChange={(e) => updateBranding("cabinetName", e.target.value)}
              className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5 block">
              Logo URL
            </label>
            <input
              type="text"
              value={config.branding.logo}
              onChange={(e) => updateBranding("logo", e.target.value)}
              className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5 block">
              Cal.com URL
            </label>
            <input
              type="text"
              value={config.branding.calUrl}
              onChange={(e) => updateBranding("calUrl", e.target.value)}
              className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40"
            />
          </div>
        </div>
      )}

      {/* Calls Tab */}
      {activeTab === "calls" && (
        <div className="space-y-6">
          {(["r1", "r2", "r3"] as const).map((phase) => (
            <div key={phase} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  {phase === "r1"
                    ? "R1 — Découverte"
                    : phase === "r2"
                      ? "R2 — Stratégie"
                      : "R3 — Closing"}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={config[phase].duration}
                    onChange={(e) => {
                      setConfig({
                        ...config,
                        [phase]: { ...config[phase], duration: Number(e.target.value) },
                      });
                    }}
                    className="w-16 bg-[#0d1425] border border-white/8 rounded-lg px-2 py-1 text-xs text-white text-center"
                    min={15}
                    max={120}
                  />
                  <span className="text-xs text-slate-500 self-center">min</span>
                </div>
              </div>
              <input
                type="text"
                value={config[phase].label}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    [phase]: { ...config[phase], label: e.target.value },
                  });
                }}
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white mb-2"
                placeholder="Label"
              />
              <textarea
                value={config[phase].description}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    [phase]: { ...config[phase], description: e.target.value },
                  });
                }}
                className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2 text-xs text-white resize-none"
                rows={2}
                placeholder="Description"
              />

              {/* Categories (R1 only has categories) */}
              {phase === "r1" && config[phase].categories && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      Questions ({config[phase].categories!.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => addCategory(phase)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      + Ajouter une question
                    </button>
                  </div>
                  {config[phase].categories!.map((cat, i) => (
                    <div
                      key={cat.key}
                      className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{cat.key}</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(phase, i)}
                          className="text-[10px] text-rose-400 hover:text-rose-300"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cat.label}
                          onChange={(e) => updateCategory(phase, i, "label", e.target.value)}
                          className="bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white"
                          placeholder="Label"
                        />
                        <select
                          value={cat.type}
                          onChange={(e) => updateCategory(phase, i, "type", e.target.value)}
                          className="bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white"
                        >
                          <option value="select">Select</option>
                          <option value="textarea">Textarea</option>
                          <option value="toggle">Toggle</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={cat.clientLabel}
                        onChange={(e) => updateCategory(phase, i, "clientLabel", e.target.value)}
                        className="w-full bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white"
                        placeholder="Label client"
                      />
                      <input
                        type="text"
                        value={cat.clientPlaceholder}
                        onChange={(e) =>
                          updateCategory(phase, i, "clientPlaceholder", e.target.value)
                        }
                        className="w-full bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white"
                        placeholder="Placeholder"
                      />
                      {cat.type === "select" && (
                        <input
                          type="text"
                          value={cat.options.join(", ")}
                          onChange={(e) =>
                            updateCategory(
                              phase,
                              i,
                              "options",
                              e.target.value.split(",").map((s) => s.trim())
                            )
                          }
                          className="w-full bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white"
                          placeholder="Options (séparées par des virgules)"
                        />
                      )}
                      <label className="flex items-center gap-2 text-[10px] text-slate-500">
                        <input
                          type="checkbox"
                          checked={cat.required}
                          onChange={(e) => updateCategory(phase, i, "required", e.target.checked)}
                          className="accent-blue-500"
                        />
                        Requis
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Visuals Tab */}
      {activeTab === "visuals" && (
        <div className="space-y-4">
          {(["r1", "r2", "r3"] as const).map((phase) => (
            <div key={phase} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                {phase === "r1"
                  ? "R1 — Écran découverte"
                  : phase === "r2"
                    ? "R2 — Écran stratégie"
                    : "R3 — Écran closing"}
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  value={(config[phase].screenClient.title as string) ?? ""}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      [phase]: {
                        ...config[phase],
                        screenClient: { ...config[phase].screenClient, title: e.target.value },
                      },
                    });
                  }}
                  className="w-full bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white"
                  placeholder="Titre"
                />
                <textarea
                  value={(config[phase].screenClient.recapTemplate as string) ?? ""}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      [phase]: {
                        ...config[phase],
                        screenClient: {
                          ...config[phase].screenClient,
                          recapTemplate: e.target.value,
                        },
                      },
                    });
                  }}
                  className="w-full bg-[#0d1425] border border-white/8 rounded px-2 py-1.5 text-xs text-white resize-none"
                  rows={2}
                  placeholder="Template de récap"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={state === "saving"}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all"
        >
          {state === "saving" ? "Sauvegarde..." : "Sauvegarder la configuration"}
        </button>
        {state === "saved" && (
          <span className="text-xs text-emerald-400">✓ Configuration sauvegardée</span>
        )}
        {state === "error" && <span className="text-xs text-rose-400">{errorMsg}</span>}
      </div>
    </div>
  );
}
