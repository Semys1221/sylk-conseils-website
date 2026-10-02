"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DocumentDropzones from "./DocumentDropzones";
import RiskProfileForm from "./RiskProfileForm";
import PaymentConfirm from "./PaymentConfirm";

type ClosingStep = "validation" | "kyc" | "risk" | "signature" | "payment" | "followup";

interface ClosingFormProps {
  channelId: string;
  isAdvisor: boolean;
  onAdvance: () => void;
  sessionId?: string;
  steps?: string[];
}

const DEFAULT_STEPS: ClosingStep[] = [
  "validation",
  "kyc",
  "risk",
  "signature",
  "payment",
  "followup",
];

export default function ClosingForm({
  channelId: _channelId,
  isAdvisor,
  onAdvance,
  sessionId,
  steps: stepsConfig,
}: ClosingFormProps) {
  const steps = (stepsConfig ?? DEFAULT_STEPS) as ClosingStep[];
  const [currentStep, setCurrentStep] = useState(0);
  const [validated, setValidated] = useState(false);
  const [riskDone, setRiskDone] = useState(false);
  const [signed, setSigned] = useState(false);
  const [paid, setPaid] = useState(false);

  const step = steps[currentStep];

  const stepLabels: Record<string, string> = {
    validation: "Validation",
    kyc: "KYC",
    risk: "Profil risque",
    signature: "Signature",
    payment: "Paiement",
    followup: "Suivi",
  };

  const canAdvance = () => {
    if (step === "validation" && !validated) return false;
    if (step === "risk" && !riskDone) return false;
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
    else onAdvance();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Closing & Mise en place</h2>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {currentStep + 1}/{steps.length}
          </span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                i === currentStep
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : i < currentStep
                    ? "bg-rose-50/50 text-rose-400 border-rose-100"
                    : "text-muted-foreground border-transparent"
              }`}
            >
              {stepLabels[s] ?? s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.15 }}
          >
            {step === "validation" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Validation finale</h3>
                <p className="text-xs text-muted-foreground">
                  Confirmez-vous l&apos;allocation et les enveloppes choisies lors de la stratégie ?
                </p>
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Allocation recommandée</p>
                  <ul className="mt-2 space-y-1 text-sm text-foreground">
                    <li>• Assurance-Vie UC : 30%</li>
                    <li>• PEA : 25%</li>
                    <li>• PER : 20%</li>
                    <li>• SCPI : 15%</li>
                    <li>• Fonds Euros : 10%</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setValidated(false)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                      validated === false && validated !== null
                        ? "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-border text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    À modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidated(true)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
                      validated === true
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-border text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    Confirmé
                  </button>
                </div>
              </div>
            )}

            {step === "kyc" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Documents KYC</h3>
                <p className="text-xs text-muted-foreground">
                  Fournissez les pièces justificatives
                </p>
                <DocumentDropzones sessionId={sessionId ?? "closing"} />
              </div>
            )}

            {step === "risk" && <RiskProfileForm onComplete={() => setRiskDone(true)} />}

            {step === "signature" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Signature des contrats</h3>
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-2">Contrats à signer :</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-foreground">Convention d&apos;entrée en relation</span>
                      <span className="text-[10px] text-muted-foreground">PDF</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-foreground">Profil investisseur</span>
                      <span className="text-[10px] text-muted-foreground">PDF</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Signature électronique
                  </p>
                  <div className="h-24 bg-card border border-border rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">[Zone de signature]</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSigned(true)}
                    className="mt-3 w-full bg-primary text-primary-foreground text-sm font-semibold rounded-xl py-3 hover:opacity-90 transition-all"
                  >
                    Signer les documents
                  </button>
                  {signed && (
                    <p className="text-xs text-emerald-600 mt-2 text-center">✓ Documents signés</p>
                  )}
                </div>
              </div>
            )}

            {step === "payment" && <PaymentConfirm amount={5000} onConfirm={() => setPaid(true)} />}

            {step === "followup" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Suivi programmé</h3>
                <p className="text-xs text-muted-foreground">
                  Planifions la première revue de votre patrimoine.
                </p>
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">
                    Date de la prochaine revue
                  </label>
                  <input
                    type="date"
                    className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-colors"
                    defaultValue={(() => {
                      const d = new Date();
                      d.setMonth(d.getMonth() + 6);
                      return d.toISOString().split("T")[0];
                    })()}
                  />
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-700">
                    ✓ Félicitations ! Votre stratégie patrimoniale est en place. Vous recevrez un
                    email récapitulatif sous 24h.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdvisor && (
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-border shrink-0">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance()}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-3 transition-all bg-primary text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground"
          >
            {currentStep < steps.length - 1 ? "Étape suivante →" : "Terminer →"}
          </button>
        </div>
      )}
    </div>
  );
}
