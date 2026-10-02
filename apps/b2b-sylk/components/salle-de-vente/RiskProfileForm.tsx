"use client";

import { useState } from "react";

interface RiskProfile {
  tolerance: "securite" | "equilibre" | "dynamique";
  horizon: number;
  experience: "aucune" | "peu" | "moyenne" | "experimentee";
  objectives: string[];
}

interface RiskProfileFormProps {
  onComplete: (profile: RiskProfile) => void;
}

const TOLERANCE_OPTIONS = [
  {
    value: "securite" as const,
    label: "Sécurité",
    desc: "Je préfère un rendement faible mais garanti",
  },
  {
    value: "equilibre" as const,
    label: "Équilibré",
    desc: "J'accepte un risque modéré pour un meilleur rendement",
  },
  {
    value: "dynamique" as const,
    label: "Dynamique",
    desc: "Je vise un rendement élevé, même avec du risque",
  },
];

const EXPERIENCE_OPTIONS = [
  { value: "aucune" as const, label: "Aucune expérience" },
  { value: "peu" as const, label: "Peu d'expérience" },
  { value: "moyenne" as const, label: "Expérience moyenne" },
  { value: "experimentee" as const, label: "Expérimenté" },
];

const OBJECTIVE_OPTIONS = [
  "Préparer la retraite",
  "Optimiser la fiscalité",
  "Transmettre mon patrimoine",
  "Faire fructifier mon épargne",
  "Constituer un apport immobilier",
];

export default function RiskProfileForm({ onComplete }: RiskProfileFormProps) {
  const [tolerance, setTolerance] = useState<RiskProfile["tolerance"] | null>(null);
  const [horizon, setHorizon] = useState<number>(10);
  const [experience, setExperience] = useState<RiskProfile["experience"] | null>(null);
  const [objectives, setObjectives] = useState<string[]>([]);

  const canSubmit = tolerance && experience;

  const toggleObjective = (obj: string) => {
    setObjectives((prev) => (prev.includes(obj) ? prev.filter((o) => o !== obj) : [...prev, obj]));
  };

  const handleSubmit = () => {
    if (!tolerance || !experience) return;
    onComplete({
      tolerance,
      horizon,
      experience,
      objectives,
    });
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-white">Profil investisseur</h3>

      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Tolérance au risque
        </p>
        <div className="space-y-2">
          {TOLERANCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTolerance(opt.value)}
              className={`w-full text-left rounded-xl border p-3 transition-all ${
                tolerance === opt.value
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10"
              }`}
            >
              <span className="text-sm font-medium text-white">{opt.label}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Horizon de placement : {horizon} ans
        </p>
        <input
          type="range"
          min={1}
          max={30}
          value={horizon}
          onChange={(e) => setHorizon(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>1 an</span>
          <span>30 ans</span>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Expérience d'investissement
        </p>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setExperience(opt.value)}
              className={`rounded-xl border p-3 text-center transition-all ${
                experience === opt.value
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10"
              }`}
            >
              <span className="text-xs text-white">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Objectifs
        </p>
        <div className="flex flex-wrap gap-2">
          {OBJECTIVE_OPTIONS.map((obj) => (
            <button
              key={obj}
              type="button"
              onClick={() => toggleObjective(obj)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                objectives.includes(obj)
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                  : "border-white/5 text-slate-400 hover:border-white/10"
              }`}
            >
              {obj}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold rounded-xl py-3 transition-all"
      >
        Valider mon profil
      </button>
    </div>
  );
}
