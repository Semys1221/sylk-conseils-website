"use client";

interface FiscalResultProps {
  tmi: number;
  revenus: number;
  epargne: number;
}

function calculateFiscalEconomy(tmi: number, revenus: number, epargne: number): number {
  const deductionMax = Math.min(revenus * 0.1, 35000);
  const epargneAnnuelle = epargne * 12;
  const deduction = Math.min(epargneAnnuelle, deductionMax);
  return deduction * (tmi / 100);
}

export default function FiscalResult({ tmi, revenus, epargne }: FiscalResultProps) {
  const economy = calculateFiscalEconomy(tmi, revenus, epargne);
  const deductionMax = Math.min(revenus * 0.1, 35000);
  const epargneAnnuelle = epargne * 12;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <p className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold mb-1">
          Économie d'impôt estimée
        </p>
        <p className="text-4xl font-bold text-emerald-400">{economy.toLocaleString("fr-FR")} €</p>
        <p className="text-xs text-emerald-400/60 mt-1">par an</p>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Détail des leviers
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <span className="text-sm">🏛️</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">PER — Déduction fiscale</p>
              <p className="text-[10px] text-slate-500">
                Jusqu'à {deductionMax.toLocaleString("fr-FR")} € déductibles par an (plafond 10% des
                revenus)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <span className="text-sm">🏗️</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">SCPI — Revenus complémentaires</p>
              <p className="text-[10px] text-slate-500">
                Rendement moyen 4-6% par an, fiscalité des revenus fonciers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <span className="text-sm">🛡️</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Assurance-Vie — Fiscalité allégée</p>
              <p className="text-[10px] text-slate-500">
                Abattement de 4 600 €/an (célibataire) ou 9 200 €/an (couple) sur les rachats
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Simulation
        </h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Épargne annuelle</span>
            <span className="text-white">{epargneAnnuelle.toLocaleString("fr-FR")} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Plafond PER applicable</span>
            <span className="text-white">{deductionMax.toLocaleString("fr-FR")} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Base de déduction</span>
            <span className="text-white">
              {Math.min(epargneAnnuelle, deductionMax).toLocaleString("fr-FR")} €
            </span>
          </div>
          <div className="border-t border-white/5 pt-1.5 flex justify-between font-semibold">
            <span className="text-slate-500">Économie d'IR</span>
            <span className="text-emerald-400">{economy.toLocaleString("fr-FR")} €/an</span>
          </div>
        </div>
      </div>
    </div>
  );
}
