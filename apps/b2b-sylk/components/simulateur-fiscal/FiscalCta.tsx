"use client";

export default function FiscalCta() {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
      <h3 className="text-sm font-semibold text-white mb-2">Prêt à optimiser votre fiscalité ?</h3>
      <p className="text-xs text-slate-400 mb-4">
        Découvrez comment une stratégie patrimoniale sur-mesure peut réduire vos impôts et faire
        fructifier votre épargne.
      </p>
      <a
        href="https://cal.eu/sylkconseils/30min"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold rounded-full px-6 py-3 hover:bg-gray-100 transition-all"
      >
        Réserver mon appel découverte →
      </a>
    </div>
  );
}
