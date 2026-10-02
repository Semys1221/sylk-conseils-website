"use client";

import { useState } from "react";

interface PaymentConfirmProps {
  amount?: number;
  onConfirm: (method: "wire" | "direct_debit") => void;
}

export default function PaymentConfirm({ amount = 5000, onConfirm }: PaymentConfirmProps) {
  const [method, setMethod] = useState<"wire" | "direct_debit" | null>(null);
  const [copied, setCopied] = useState(false);

  const rib = "FR76 1234 5678 9012 3456 7890 123";

  const copyRib = () => {
    void navigator.clipboard.writeText(rib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-white">Paiement & exécution</h3>
      <p className="text-xs text-slate-500">
        Montant à verser :{" "}
        <span className="text-white font-semibold">{amount.toLocaleString("fr-FR")} €</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMethod("wire")}
          className={`rounded-xl border p-4 text-left transition-all ${
            method === "wire"
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-white/5 bg-white/[0.02] hover:border-white/10"
          }`}
        >
          <span className="text-sm font-medium text-white">Virement bancaire</span>
          <p className="text-[11px] text-slate-500 mt-1">RIB à utiliser pour le virement</p>
        </button>

        <button
          type="button"
          onClick={() => setMethod("direct_debit")}
          className={`rounded-xl border p-4 text-left transition-all ${
            method === "direct_debit"
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-white/5 bg-white/[0.02] hover:border-white/10"
          }`}
        >
          <span className="text-sm font-medium text-white">Prélèvement automatique</span>
          <p className="text-[11px] text-slate-500 mt-1">Mise en place d'un mandat SEPA</p>
        </button>
      </div>

      {method === "wire" && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">RIB</span>
            <button
              type="button"
              onClick={copyRib}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
            >
              {copied ? "Copié !" : "Copier le RIB"}
            </button>
          </div>
          <code className="text-sm text-white font-mono tracking-wider">{rib}</code>
          <p className="text-[11px] text-slate-600 mt-2">
            Les fonds seront investis sous 48h ouvrées après réception
          </p>
        </div>
      )}

      {method === "direct_debit" && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <label className="text-[11px] font-semibold text-slate-500 uppercase mb-2 block">
            IBAN
          </label>
          <input
            type="text"
            placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            className="w-full bg-[#0d1425] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
          />
        </div>
      )}

      {method && (
        <button
          type="button"
          onClick={() => onConfirm(method)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl py-3 transition-all"
        >
          Confirmer le paiement
        </button>
      )}
    </div>
  );
}
