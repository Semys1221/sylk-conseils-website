"use client";

import { useState, useEffect, useRef } from "react";
import type { CallConfigCategory } from "@workspace/tenant-ui";
import PatrimonyChart from "./PatrimonyChart";

type FormValues = Record<string, string | boolean>;

interface DiscoveryFormProps {
  channelId: string;
  isCgpMode: boolean;
  onAdvance: () => void;
  fields?: CallConfigCategory[];
}

const DEFAULT_FIELDS: CallConfigCategory[] = [
  {
    key: "famille",
    label: "Situation familiale",
    type: "select",
    options: ["Célibataire", "Marié(e)/Pacsé(e)", "Divorcé(e)", "Veuf/Veuve"],
    script: "",
    clientLabel: "Situation familiale",
    clientPlaceholder: "Sélectionnez...",
    required: true,
  },
  {
    key: "enfants",
    label: "Enfants",
    type: "select",
    options: ["0", "1", "2", "3+"],
    script: "",
    clientLabel: "Enfants à charge",
    clientPlaceholder: "Sélectionnez...",
    required: false,
  },
  {
    key: "profession",
    label: "Situation professionnelle",
    type: "select",
    options: [
      "Profession libérale (BNC)",
      "Dirigeant (BIC)",
      "Cadre salarié",
      "Fonctionnaire",
      "Retraité",
    ],
    script: "",
    clientLabel: "Statut professionnel",
    clientPlaceholder: "Sélectionnez...",
    required: true,
  },
  {
    key: "secteur",
    label: "Secteur d'activité",
    type: "textarea",
    options: [],
    script: "",
    clientLabel: "Secteur",
    clientPlaceholder: "Décrivez votre activité...",
    required: false,
  },
  {
    key: "patrimoine",
    label: "Patrimoine actuel",
    type: "textarea",
    options: [],
    script: "",
    clientLabel: "Votre patrimoine",
    clientPlaceholder: "Immobilier, assurance-vie, livrets, PEA, PER...",
    required: true,
  },
  {
    key: "fiscalite",
    label: "Fiscalité",
    type: "select",
    options: ["TMI 0%", "TMI 11%", "TMI 30%", "TMI 41%", "TMI 45%"],
    script: "",
    clientLabel: "Tranche fiscale",
    clientPlaceholder: "Sélectionnez...",
    required: true,
  },
  {
    key: "objectifs",
    label: "Objectifs",
    type: "select",
    options: [
      "Préparer la retraite",
      "Optimiser ma fiscalité",
      "Transmettre mon patrimoine",
      "Faire fructifier mon épargne",
    ],
    script: "",
    clientLabel: "Objectif principal",
    clientPlaceholder: "Sélectionnez...",
    required: true,
  },
  {
    key: "risque",
    label: "Tolérance au risque",
    type: "select",
    options: ["Sécurité", "Équilibré", "Dynamique"],
    script: "",
    clientLabel: "Profil de risque",
    clientPlaceholder: "Sélectionnez...",
    required: true,
  },
  {
    key: "freins",
    label: "Freins et déceptions",
    type: "textarea",
    options: [],
    script: "",
    clientLabel: "Expériences passées",
    clientPlaceholder: "Mauvais placements, banques, méfiance...",
    required: false,
  },
];

export default function DiscoveryForm({
  channelId,
  isCgpMode,
  onAdvance,
  fields,
}: DiscoveryFormProps) {
  const [values, setValues] = useState<FormValues>({});
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
  const pusherRef = useRef<unknown>(null);
  const FIELDS = fields ?? DEFAULT_FIELDS;

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu";
    if (!pusherKey || pusherKey === "not-set") return;
    let cleanup: (() => void) | undefined;
    import("pusher-js").then(({ default: Pusher }) => {
      const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
      pusherRef.current = pusher;
      const ch = pusher.subscribe(channelId);
      ch.bind("field-update", (data: { fieldKey: string; value: string; source: string }) => {
        if (data.source === (isCgpMode ? "cgp" : "client")) return;
        setValues((p) => ({ ...p, [data.fieldKey]: data.value }));
        setHighlighted((p) => ({ ...p, [data.fieldKey]: true }));
        setTimeout(() => setHighlighted((p) => ({ ...p, [data.fieldKey]: false })), 2500);
      });
      cleanup = () => {
        ch.unbind_all();
        pusher.unsubscribe(channelId);
        pusher.disconnect();
      };
    });
    return () => cleanup?.();
  }, [channelId, isCgpMode]);

  const broadcast = async (fieldKey: string, value: string) => {
    try {
      await fetch("/api/salle-de-vente/sync-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldKey, value, source: isCgpMode ? "cgp" : "client", channelId }),
      });
    } catch {
      /* ignore */
    }
  };

  const handleChange = (fieldKey: string, value: string | boolean) => {
    setValues((p) => ({ ...p, [fieldKey]: value }));
    void broadcast(fieldKey, String(value));
  };

  const completedCount = FIELDS.filter((f) => {
    const v = values[f.key];
    return v !== undefined && v !== "" && v !== false;
  }).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Questionnaire de découverte</h2>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {completedCount}/{FIELDS.length}
          </span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / FIELDS.length) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          {isCgpMode
            ? "✦ Mode CGP — vos réponses se synchronisent en temps réel"
            : "Remplissez en direct avec votre conseiller SYLK Conseils"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-3">
        {values.patrimoine && values.patrimoine !== "" && (
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <PatrimonyChart answers={values as Record<string, string>} />
          </div>
        )}

        {FIELDS.map((field) => {
          const value = values[field.key];
          const isHighlighted = !!highlighted[field.key];
          return (
            <div
              key={field.key}
              className={`rounded-xl border p-3 sm:p-4 transition-all duration-300 ${
                isHighlighted
                  ? "border-blue-300 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.06)]"
                  : "border-border bg-card hover:border-muted-foreground/20"
              }`}
            >
              <label className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <span>{field.label}</span>
                {field.required && <span className="text-[10px] text-red-500">*</span>}
                {isHighlighted && (
                  <span className="ml-auto text-[10px] text-blue-500 normal-case tracking-normal">
                    ● mis à jour
                  </span>
                )}
              </label>

              {field.type === "select" && (
                <select
                  value={(value as string) ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="text-muted-foreground">
                    {field.clientPlaceholder}
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "textarea" && (
                <textarea
                  value={(value as string) ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.clientPlaceholder}
                  rows={3}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 resize-none transition-colors"
                />
              )}
            </div>
          );
        })}
      </div>

      {!isCgpMode && (
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-border shrink-0">
          <button
            onClick={onAdvance}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border rounded-xl py-3 transition-all"
          >
            <span>Passer à la stratégie</span>
            <span className="text-xs opacity-60">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
