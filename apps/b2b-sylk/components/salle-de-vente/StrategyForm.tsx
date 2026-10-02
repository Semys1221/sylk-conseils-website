"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import AuditSummary from "./AuditSummary";
import ProjectionChart from "./ProjectionChart";
import AllocationTarget from "./AllocationTarget";

type StrategyStep = "audit" | "projection" | "allocation" | "validation";

interface StrategyFormProps {
  channelId: string;
  isAdvisor: boolean;
  discoveryAnswers?: Record<string, string>;
  onAdvance: () => void;
  steps?: string[];
}

const DEFAULT_STEPS: StrategyStep[] = ["audit", "projection", "allocation", "validation"];

export default function StrategyForm({
  channelId: _channelId,
  isAdvisor,
  discoveryAnswers = {},
  onAdvance,
  steps: stepsConfig,
}: StrategyFormProps) {
  const steps = (stepsConfig ?? DEFAULT_STEPS) as StrategyStep[];
  const [currentStep, setCurrentStep] = useState(0);
  const [validationScore, setValidationScore] = useState<number | null>(null);
  const [validationNote, setValidationNote] = useState("");

  const step = steps[currentStep];

  const stepLabels: Record<string, string> = {
    audit: "Audit",
    projection: "Projection",
    allocation: "Allocation",
    validation: "Validation",
  };

  const canAdvance = () => !(step === "validation" && validationScore === null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
    else onAdvance();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Stratégie Patrimoniale</h2>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {currentStep + 1}/{steps.length}
          </span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-1.5 mt-2">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                i === currentStep
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : i < currentStep
                    ? "bg-emerald-50/50 text-emerald-400 border-emerald-100"
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
            {step === "audit" && <AuditSummary discoveryAnswers={discoveryAnswers} />}
            {step === "projection" && <ProjectionChart />}
            {step === "allocation" && <AllocationTarget />}
            {step === "validation" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Validation</h3>
                <p className="text-xs text-muted-foreground">
                  Sur une échelle de 1 à 10, à quel point cette stratégie correspond à vos attentes
                  ?
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setValidationScore(n)}
                      className={`w-9 h-9 rounded-full text-xs font-semibold border transition-all ${
                        validationScore === n
                          ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                          : "border-border text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <textarea
                  value={validationNote}
                  onChange={(e) => setValidationNote(e.target.value)}
                  placeholder="Qu'est-ce qui vous empêcherait de mettre en place cette stratégie aujourd'hui ?"
                  rows={3}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 resize-none transition-colors"
                />
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
            {currentStep < steps.length - 1 ? "Étape suivante →" : "Passer au closing →"}
          </button>
        </div>
      )}
    </div>
  );
}
