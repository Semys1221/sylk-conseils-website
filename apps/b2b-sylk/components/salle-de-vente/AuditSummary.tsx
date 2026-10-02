"use client";

interface AuditSummaryProps {
  discoveryAnswers: Record<string, string>;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
}

export default function AuditSummary({
  discoveryAnswers,
  strengths = [
    "Situation professionnelle stable",
    "Capacité d'épargne régulière",
    "Objectifs clairement définis",
  ],
  weaknesses = [
    "Fiscalité non optimisée",
    "Allocation inadaptée au profil de risque",
    "Produits d'épargne peu performants",
  ],
  opportunities = [
    "Déduction PER jusqu'à 35 000 €/an",
    "Optimisation TMI via défiscalisation",
    "Diversification SCPI",
  ],
}: AuditSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white">Audit patrimonial</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
            Forces
          </span>
          <ul className="mt-2 space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="text-xs text-emerald-300/80 flex items-start gap-1.5">
                <span className="text-emerald-400 mt-0.5">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
            Faiblesses
          </span>
          <ul className="mt-2 space-y-1.5">
            {weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-rose-300/80 flex items-start gap-1.5">
                <span className="text-rose-400 mt-0.5">−</span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
            Opportunités
          </span>
          <ul className="mt-2 space-y-1.5">
            {opportunities.map((o, i) => (
              <li key={i} className="text-xs text-blue-300/80 flex items-start gap-1.5">
                <span className="text-blue-400 mt-0.5">→</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {discoveryAnswers.objectifs && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Objectifs identifiés
          </span>
          <p className="mt-1 text-sm text-slate-300">{discoveryAnswers.objectifs}</p>
        </div>
      )}
    </div>
  );
}
