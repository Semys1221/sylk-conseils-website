"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FiscalInputs from "@/components/simulateur-fiscal/FiscalInputs";
import FiscalResult from "@/components/simulateur-fiscal/FiscalResult";
import FiscalCta from "@/components/simulateur-fiscal/FiscalCta";

function SimulateurContent() {
  const searchParams = useSearchParams();

  const [tmi, setTmi] = useState(30);
  const [revenus, setRevenus] = useState(120000);
  const [epargne, setEpargne] = useState(2000);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (searchParams) {
      const tmiParam = searchParams.get("tmi");
      const revParam = searchParams.get("revenus");
      const epargneParam = searchParams.get("epargne");
      if (tmiParam) setTmi(Number(tmiParam));
      if (revParam) setRevenus(Number(revParam));
      if (epargneParam) setEpargne(Number(epargneParam));
    }
  }, [searchParams]);

  const handleChange = (field: "tmi" | "revenus" | "epargne", value: number) => {
    if (field === "tmi") setTmi(value);
    if (field === "revenus") setRevenus(value);
    if (field === "epargne") setEpargne(value);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="heading-2 font-serif font-semibold mb-2">Simulateur d'économie fiscale</h1>
          <p className="text-small text-muted">
            Estimez votre potentiel d'économie d'impôt en 30 secondes
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 mb-6">
          <FiscalInputs tmi={tmi} revenus={revenus} epargne={epargne} onChange={handleChange} />
        </div>

        {showResult && (
          <div className="space-y-6">
            <FiscalResult tmi={tmi} revenus={revenus} epargne={epargne} />
            <FiscalCta />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SimulateurFiscalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <SimulateurContent />
    </Suspense>
  );
}
