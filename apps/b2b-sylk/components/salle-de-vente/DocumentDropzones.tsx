"use client";

import DropzoneCard from "./DropzoneCard";

export interface DocumentCategory {
  id: string;
  icon: string;
  title: string;
  color: string;
  documents: string[];
  accept: string;
}

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: "entreprise",
    icon: "🏢",
    title: "Entreprise",
    color: "blue",
    documents: ["Kbis de moins de 3 mois", "RIB de la société"],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "marketing",
    icon: "📈",
    title: "Marketing Actuel",
    color: "emerald",
    documents: [
      "Plaquette commerciale",
      "Exemples de créatifs (Ads)",
      "Statistiques des 3 derniers mois",
    ],
    accept: ".pdf,.jpg,.jpeg,.png,.csv",
  },
  {
    id: "acces",
    icon: "🔑",
    title: "Comptes & Accès",
    color: "violet",
    documents: ["ID Business Manager", "ID Google Analytics", "Exports CRM"],
    accept: ".pdf,.txt,.csv",
  },
  {
    id: "historique",
    icon: "📜",
    title: "Historique",
    color: "amber",
    documents: ["Anciens contrats agence", "Rapports de perf. précédents"],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
];

interface DocumentDropzonesProps {
  sessionId: string;
}

export default function DocumentDropzones({ sessionId }: DocumentDropzonesProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5 shrink-0">
        <h2 className="text-sm font-semibold text-white mb-1">Dépôt des pièces justificatives</h2>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Glissez-déposez vos documents. Votre conseiller reste avec vous pendant cette étape.
        </p>
      </div>

      {/* 2×2 grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
        {DOCUMENT_CATEGORIES.map((cat) => (
          <DropzoneCard key={cat.id} category={cat} sessionId={sessionId} />
        ))}
      </div>
    </div>
  );
}
