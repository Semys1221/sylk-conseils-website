"use client";

import { useState, useEffect } from "react";
import { Calendar, ShieldCheck, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@supabase/supabase-js";
import { useTenant } from "../../tenant-config";
import { ProgressionCircle } from "./ProgressionCircle";
import { FunnelEligible } from "./FunnelEligible";
import type { FunnelOption, FunnelStep } from "../../tenant-config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type ResultType = "qualified" | "eligible" | "disqualified";

function evaluateFunnel(answers: Record<string, string>): ResultType {
  const values = Object.values(answers);
  if (values.includes("disqualified")) return "disqualified";
  if (values.includes("eligible")) return "eligible";
  return "qualified";
}

interface FunnelDiagnosticProps {
  onBack: () => void;
}

export function FunnelDiagnostic({ onBack }: FunnelDiagnosticProps) {
  const tenant = useTenant();
  const { colors, funnel, calendlyUrl } = tenant;
  const content = funnel.content;

  const [stepsConfig, setStepsConfig] = useState<FunnelStep[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  type Phase = "loading" | "question" | "result" | "eligible";
  const [phase, setPhase] = useState<Phase>("loading");
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [resultType, setResultType] = useState<ResultType>("qualified");

  const [sessionId, setSessionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setSessionId(
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );

    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("funnel_config")
        .select("config")
        .eq("tenant_id", funnel.tenantId)
        .single();

      let steps: FunnelStep[] = [];
      if (!error && data?.config?.steps) {
        steps = data.config.steps;
      } else if (funnel.steps.length > 0) {
        steps = funnel.steps;
      }

      setStepsConfig(steps);

      if (steps.length > 0) {
        setCurrentStepId(steps[0].id);
        setPhase("question");
      }

      setLoadingConfig(false);
    };

    fetchConfig();

    const channel = supabase
      .channel(`funnel-${funnel.tenantId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "funnel_config" },
        (payload) => {
          if (payload.new.tenant_id === funnel.tenantId && payload.new.config?.steps) {
            setStepsConfig(payload.new.config.steps);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [funnel.tenantId, funnel.steps]);

  const syncStepToAdmin = (stepNumber: number, newAnswers: Record<string, string>) => {
    if (sessionId) {
      fetch("/api/funnel/sync-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          tenantId: funnel.tenantId,
          step: stepNumber,
          answers: newAnswers,
        }),
      }).catch(() => {});
    }
  };

  const handleAnswer = async (option: FunnelOption) => {
    if (!currentStepId) return;

    const currentStepIndex = stepsConfig.findIndex((s) => s.id === currentStepId);
    const currentStep = stepsConfig[currentStepIndex];

    const newAnswers = { ...answers, [currentStep.id]: option.value };
    setAnswers(newAnswers);

    syncStepToAdmin(currentStepIndex + 2, newAnswers);

    const nextAction = option.nextStepId;

    if (nextAction === "end_qualified") {
      finishFunnel(newAnswers);
    } else if (nextAction === "end_disqualified") {
      finishFunnel(newAnswers);
    } else if (nextAction) {
      setCurrentStepId(nextAction);
    } else {
      if (currentStepIndex + 1 < stepsConfig.length) {
        setCurrentStepId(stepsConfig[currentStepIndex + 1].id);
      } else {
        finishFunnel(newAnswers);
      }
    }
  };

  const finishFunnel = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);

    const result = evaluateFunnel(finalAnswers);

    try {
      await fetch("/api/funnel/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...finalAnswers, tenant_id: funnel.tenantId, result }),
      });
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
      setResultType(result);
      if (result === "eligible") {
        setPhase("eligible");
      } else {
        setPhase("result");
      }
      syncStepToAdmin(6, finalAnswers);
    }
  };

  const calendlyUrlActual = process.env.NEXT_PUBLIC_CALENDLY_URL ?? calendlyUrl;

  const currentStepIndex = currentStepId
    ? stepsConfig.findIndex((s) => s.id === currentStepId)
    : -1;

  const renderQuestion = () => {
    const stepObj = stepsConfig.find((s) => s.id === currentStepId);
    if (!stepObj) return null;

    return (
      <motion.div
        key={`q-${stepObj.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[560px]"
      >
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F9F9F9] border border-[#E4E1DC] px-3.5 py-1.5 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#999999] mb-6">
            Question {currentStepIndex + 1} sur {stepsConfig.length}
          </div>
          <h3 className="text-[1.65rem] md:text-[1.85rem] font-bold text-[#111111] leading-snug tracking-tight">
            {stepObj.title}
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {stepObj.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt)}
              disabled={isSubmitting}
              className="w-full text-left bg-white border border-[#E4E1DC] px-5 py-4 rounded-2xl transition-all duration-200 hover:border-[#111111] hover:shadow-sm active:scale-[0.98] disabled:opacity-60 flex items-center justify-between group"
            >
              <span className="text-sm md:text-base text-[#111111] font-medium">{opt.label}</span>
              <div className="w-6 h-6 rounded-full border-2 border-[#D4D4D4] flex items-center justify-center shrink-0 ml-4 transition-colors group-hover:border-[#111111]">
                <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#111111] transition-colors" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-[#999999] text-xs">
          <div className="h-px flex-1 bg-[#E4E1DC]" />
          <span>Appuyez sur une option pour continuer</span>
          <ChevronRight size={12} className="text-[#999999]" />
        </div>
      </motion.div>
    );
  };

  const renderResult = () => {
    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[580px] w-full mx-auto text-left"
      >
        {resultType === "qualified" ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[#111111] flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3 leading-tight">
              {content.qualifiedTitle}
            </h2>
            <p className="text-[#666666] text-base leading-relaxed font-light mb-8">
              {content.qualifiedMessage}
            </p>
            <a
              href={calendlyUrlActual}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#111111] text-white px-8 py-[0.875rem] rounded-full items-center justify-center gap-2 font-semibold hover:bg-[#2a2a2a] transition-all duration-300 active:scale-95 shadow-lg"
            >
              <Calendar size={16} className="text-white/80" />
              <span>{content.qualifiedCta}</span>
            </a>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[#F4B400]/10 border border-[#F4B400]/20 flex items-center justify-center mb-6">
              <ShieldCheck size={32} className="text-[#F4B400]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3 leading-tight">
              {content.disqualifiedTitle}
            </h2>
            <p className="text-[#666666] text-base leading-relaxed font-light mb-8">
              {content.disqualifiedMessage}
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 border border-[#D4D4D4] text-[#111111] px-8 py-[0.875rem] rounded-full font-medium hover:bg-[#F9F9F9] transition-all duration-300 active:scale-95"
            >
              <span>Retour à l&apos;accueil</span>
            </button>
          </>
        )}
      </motion.div>
    );
  };

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#F9F9F9] gap-3">
        <Loader2 size={24} className="animate-spin text-[#999999]" />
        <p className="text-[#999999] text-sm">{content.loadingText || "Chargement..."}</p>
      </div>
    );
  }

  if (phase === "eligible") {
    return (
      <div className="flex w-full min-h-screen bg-[#F9F9F9]">
        <div className="flex-1 flex items-center justify-center px-6 py-16 md:py-24 lg:px-16">
          <FunnelEligible onBack={onBack} onEmailSubmitted={() => {}} />
        </div>
        <div className="hidden md:flex w-[40%] bg-[#E4E1DC] items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E4E1DC] to-[#d6d3ce] pointer-events-none" />
          <div className="relative z-10">
            <ProgressionCircle current={stepsConfig.length} total={stepsConfig.length} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#F9F9F9]">
      <div className="flex-1 flex items-center justify-center px-6 py-16 md:py-24 lg:px-16">
        <div className="w-full max-w-[600px]">
          <AnimatePresence mode="wait">
            {phase === "question" && renderQuestion()}
            {phase === "result" && renderResult()}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden md:flex w-[40%] bg-[#E4E1DC] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E4E1DC] to-[#d6d3ce] pointer-events-none" />
        <div className="relative z-10">
          {phase === "question" && (
            <ProgressionCircle current={currentStepIndex + 1} total={stepsConfig.length} />
          )}
          {phase === "result" && (
            <ProgressionCircle current={stepsConfig.length} total={stepsConfig.length} />
          )}
        </div>
      </div>
    </div>
  );
}
