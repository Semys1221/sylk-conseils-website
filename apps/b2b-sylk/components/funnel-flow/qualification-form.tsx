"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useFlowStore } from "./store";

const questions = [
  {
    key: "statut",
    label: "Quel est le statut de votre structure ?",
    options: [
      { value: "", label: "Sélectionnez une option" },
      { value: "solo", label: "Solo" },
      { value: "associe", label: "Associé en société" },
    ],
  },
  {
    key: "imposition",
    label: "Quelle est votre tranche d'imposition annuelle estimée ?",
    options: [
      { value: "", label: "Sélectionnez une option" },
      { value: "moins_10k", label: "< 10k€" },
      { value: "10k_30k", label: "10k€ – 30k€" },
      { value: "plus_30k", label: "+ 30k€" },
    ],
  },
  {
    key: "leviers",
    label: "Avez-vous déjà mis en place des leviers d'optimisation (PER, Holding, Immobilier) ?",
    options: [
      { value: "", label: "Sélectionnez une option" },
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
    ],
  },
];

interface QualificationFormProps {
  eventUri?: string | null;
  inviteeUri?: string | null;
}

export function QualificationForm({
  eventUri: propEventUri,
  inviteeUri: propInviteeUri,
}: QualificationFormProps = {}) {
  const storeAnswers = useFlowStore((s) => s.answers);
  const storeAnswerQuestion = useFlowStore((s) => s.answerQuestion);
  const storeEventUri = useFlowStore((s) => s.eventUri);
  const storeInviteeUri = useFlowStore((s) => s.inviteeUri);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [direction, setDirection] = useState(0);

  const standalone = propEventUri !== undefined;
  const eventUri = standalone ? propEventUri : storeEventUri;
  const inviteeUri = standalone ? propInviteeUri : storeInviteeUri;
  const answers = standalone ? localAnswers : storeAnswers;

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;
  const hasAnswer = answers[currentQuestion?.key] && answers[currentQuestion?.key] !== "";
  const allAnswered = questions.every((q) => answers[q.key] && answers[q.key] !== "");
  const progress = ((step + (hasAnswer ? 1 : 0)) / questions.length) * 100;

  const answerQuestion = (key: string, value: string) => {
    if (standalone) {
      setLocalAnswers((prev) => ({ ...prev, [key]: value }));
    } else {
      storeAnswerQuestion(key, value);
    }
  };

  const handleSelect = (key: string, value: string) => {
    answerQuestion(key, value);
    setTimeout(() => {
      if (step < questions.length - 1) {
        setDirection(1);
        setStep((s) => s + 1);
      }
    }, 300);
  };

  const goToStep = useCallback((s: number) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  }, [step]);

  const handleSubmit = async () => {
    if (!allAnswered || sending) return;
    setSending(true);

    try {
      await Promise.all([
        fetch("/api/funnel/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "sylk-conseils-funnel",
            tenantId: "sylk-conseils",
            result: "qualified",
            answers,
          }),
        }),
        eventUri && inviteeUri
          ? fetch("/api/booking-notify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eventUri,
                inviteeUri,
                answers,
                tenantId: "sylk-conseils",
              }),
            })
          : Promise.resolve(),
      ]);
    } catch {}

    setSubmitted(true);
    setSending(false);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center"
        >
          <CheckCircle2 size={36} className="text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-slate-800">Merci pour vos réponses</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
          Un de nos conseillers prendra connaissance de votre situation avant l&apos;échange.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 gap-6">
      <div className="text-center shrink-0 pt-2">
        <h2 className="text-xl font-semibold text-slate-800 leading-snug tracking-tight">
          Quelques précisions avant l&apos;échange
        </h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Question {step + 1} sur {questions.length}
        </p>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-slate-800 rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.key}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <label className="text-sm font-medium text-slate-700">
              {currentQuestion.label}
            </label>
            <div className="flex flex-col gap-2">
              {currentQuestion.options
                .filter((o) => o.value !== "")
                .map((opt) => {
                  const selected = answers[currentQuestion.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(currentQuestion.key, opt.value)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                        selected
                          ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                          : "bg-white text-slate-700 border-gray-200 hover:border-slate-300 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between shrink-0">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Précédent
          </button>
        ) : (
          <div />
        )}

        {isLastStep && allAnswered ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className="px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all shadow-sm bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        ) : hasAnswer ? (
          <button
            type="button"
            onClick={() => goToStep(step + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all shadow-sm bg-slate-800 text-white hover:bg-slate-700"
          >
            Suivant
            <ArrowRight size={16} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
