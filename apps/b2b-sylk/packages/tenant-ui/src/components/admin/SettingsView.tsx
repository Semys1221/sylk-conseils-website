"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Phone, Globe, Mail, Plus, X, Check, AlertCircle, Star } from "lucide-react";
import type { TenantSettings, ScreeningLevel, DiscoveryQuestion } from "@workspace/shared-types";
import { useTenant } from "../../tenant-config";

interface SettingsViewProps {
  tenantId: string;
}

function EmailChip({ email, onRemove }: { email: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
      <Mail size={10} />
      {email}
      <button onClick={onRemove} className="text-gray-400 hover:text-gray-600 ml-0.5">
        <X size={10} />
      </button>
    </span>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  onSave,
  saving,
}: {
  title: string;
  description: string;
  icon: typeof Phone;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 p-2 rounded-xl">
            <Icon size={16} className="text-gray-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
      <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50 flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-black disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Confirmer
        </button>
      </div>
    </div>
  );
}

export function SettingsView({ tenantId }: SettingsViewProps) {
  const tenant = useTenant();
  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [newRecipient, setNewRecipient] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    key: "",
    label: "",
    type: "text" as DiscoveryQuestion["type"],
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/settings?tenant_id=${tenantId}`);
        if (res.ok) {
          const { data } = await res.json();
          setSettings(data);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tenantId]);

  const sendNotification = async (section: string) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          settings: {},
          notify: true,
          section,
        }),
      });
    } catch {
      /* ignore */
    }
  };

  const handleSaveCallSettings = async () => {
    if (!settings) return;
    setSavingSection("call");
    setSaveSuccess(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          settings: { callSettings: settings.callSettings },
        }),
      });
      if (res.ok) {
        setSaveSuccess("call");
        await sendNotification("call");
        setTimeout(() => setSaveSuccess(null), 2000);
      }
    } catch {
      /* ignore */
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveWebsiteSettings = async () => {
    if (!settings) return;
    setSavingSection("website");
    setSaveSuccess(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          settings: { websiteSettings: settings.websiteSettings },
        }),
      });
      if (res.ok) {
        setSaveSuccess("website");
        await sendNotification("website");
        setTimeout(() => setSaveSuccess(null), 2000);
      }
    } catch {
      /* ignore */
    } finally {
      setSavingSection(null);
    }
  };

  const addRecipient = () => {
    if (!settings || !newRecipient.includes("@")) return;
    setSettings({
      ...settings,
      callSettings: {
        ...settings.callSettings,
        defaultRecipients: [...settings.callSettings.defaultRecipients, newRecipient],
      },
    });
    setNewRecipient("");
  };

  const removeRecipient = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      callSettings: {
        ...settings.callSettings,
        defaultRecipients: settings.callSettings.defaultRecipients.filter((_, i) => i !== index),
      },
    });
  };

  const addQuestion = () => {
    if (!settings || !newQuestion.key || !newQuestion.label) return;
    setSettings({
      ...settings,
      callSettings: {
        ...settings.callSettings,
        discoveryQuestions: [
          ...settings.callSettings.discoveryQuestions,
          { ...newQuestion, required: false },
        ],
      },
    });
    setNewQuestion({ key: "", label: "", type: "text" });
  };

  const removeQuestion = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      callSettings: {
        ...settings.callSettings,
        discoveryQuestions: settings.callSettings.discoveryQuestions.filter((_, i) => i !== index),
      },
    });
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 size={20} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center py-20">
        <AlertCircle size={20} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Impossible de charger les paramètres.</p>
      </div>
    );
  }

  const testimonials = tenant.testimonials?.items ?? [];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">
          Paramètres
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez les paramètres de votre espace.</p>
      </div>

      <div className="space-y-6">
        {/* Section Call */}
        <SectionCard
          title="Appels"
          description="Configuration des appels de découverte"
          icon={Phone}
          onSave={handleSaveCallSettings}
          saving={savingSection === "call"}
        >
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Destinataires par défaut
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {settings.callSettings.defaultRecipients.map((r, i) => (
                <EmailChip key={i} email={r} onRemove={() => removeRecipient(i)} />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                placeholder="email@exemple.com"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
              <button
                onClick={addRecipient}
                disabled={!newRecipient.includes("@")}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 disabled:opacity-40 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Questions du call de découverte
            </label>
            <div className="space-y-2 mb-2">
              {settings.callSettings.discoveryQuestions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="flex-1 text-xs text-gray-700">{q.label}</span>
                  <span className="text-[10px] text-gray-400 uppercase">{q.type}</span>
                  <button
                    onClick={() => removeQuestion(i)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newQuestion.key}
                onChange={(e) => setNewQuestion({ ...newQuestion, key: e.target.value })}
                placeholder="Clé"
                className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
              <input
                value={newQuestion.label}
                onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
                placeholder="Question"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={addQuestion}
                disabled={!newQuestion.key || !newQuestion.label}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 disabled:opacity-40 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Niveau de screening
            </label>
            <div className="flex gap-2">
              {(["simple", "medium", "hard"] as ScreeningLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      callSettings: { ...settings.callSettings, screeningLevel: level },
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                    settings.callSettings.screeningLevel === level
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {level === "simple" ? "Simple" : level === "medium" ? "Moyen" : "Avancé"}
                </button>
              ))}
            </div>
          </div>

          {saveSuccess === "call" && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
              <Check size={12} />
              Paramètres enregistrés
            </div>
          )}
        </SectionCard>

        {/* Section Website */}
        <SectionCard
          title="Site web"
          description="Configuration du site public"
          icon={Globe}
          onSave={handleSaveWebsiteSettings}
          saving={savingSection === "website"}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Domaine</label>
              <input
                type="text"
                value={settings.websiteSettings.domain}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    websiteSettings: { ...settings.websiteSettings, domain: e.target.value },
                  })
                }
                placeholder="mondomaine.fr"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">ORIAS</label>
              <input
                type="text"
                value={settings.websiteSettings.orias}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    websiteSettings: { ...settings.websiteSettings, orias: e.target.value },
                  })
                }
                placeholder="ORIAS n°..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Mentions légales
              </label>
              <textarea
                value={settings.websiteSettings.legalMentions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    websiteSettings: { ...settings.websiteSettings, legalMentions: e.target.value },
                  })
                }
                rows={3}
                placeholder="Mentions légales..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Ton</label>
              <input
                type="text"
                value={settings.websiteSettings.tone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    websiteSettings: { ...settings.websiteSettings, tone: e.target.value },
                  })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Couleur</label>
              <input
                type="text"
                value={settings.websiteSettings.color}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    websiteSettings: { ...settings.websiteSettings, color: e.target.value },
                  })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
              />
            </div>
          </div>

          {saveSuccess === "website" && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
              <Check size={12} />
              Paramètres enregistrés
            </div>
          )}
        </SectionCard>

        {/* Section Avis */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-xl">
                <Star size={16} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Avis clients</h3>
                <p className="text-xs text-gray-400">
                  Témoignages affichés sur la page d&apos;accueil
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            {testimonials.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Aucun avis configuré</p>
            ) : (
              <div className="space-y-3">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
                        {t.initial}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{t.author}</p>
                        <p className="text-[10px] text-gray-400">{t.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
