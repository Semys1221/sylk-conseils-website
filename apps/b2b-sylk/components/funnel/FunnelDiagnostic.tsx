"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MeshBackground } from "@workspace/tenant-ui";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface FunnelDiagnosticProps {
  onBack: () => void;
}

type FunnelOption = {
  id: string;
  label: string;
  value: string;
  nextStepId?: string | null;
};

type FunnelStep = {
  id: string;
  title: string;
  options: FunnelOption[];
};

const DEFAULT_STEPS: FunnelStep[] = [
  {
    id: "step_1",
    title: "Votre situation professionnelle actuelle",
    options: [
      { id: "opt_1_1", label: "Cadre indépendant / Dirigeant d'entreprise", value: "Option A" },
      { id: "opt_1_2", label: "Profession libérale", value: "Option B" },
      { id: "opt_1_3", label: "Cadre salarié", value: "Option C" },
      { id: "opt_1_4", label: "Étudiant / En transition professionnelle", value: "Option D" },
    ],
  },
  {
    id: "step_2",
    title: "Le montant de votre impôt sur le revenu annuel",
    options: [
      { id: "opt_2_1", label: "Moins de 3 000 € par an", value: "Option A" },
      { id: "opt_2_2", label: "Entre 3 000 € et 10 000 € par an", value: "Option B" },
      { id: "opt_2_3", label: "Plus de 10 000 € par an", value: "Option C" },
    ],
  },
  {
    id: "step_3",
    title: "Votre épargne financière immédiatement disponible (Stock)",
    options: [
      { id: "opt_3_1", label: "Moins de 10 000 €", value: "Option A" },
      { id: "opt_3_2", label: "Entre 10 000 € et 50 000 €", value: "Option B" },
      { id: "opt_3_3", label: "Plus de 50 000 €", value: "Option C" },
    ],
  },
  {
    id: "step_4",
    title: "Votre capacité d'investissement ou d'épargne mensuelle",
    options: [
      { id: "opt_4_1", label: "Moins de 300 € par mois", value: "Option A" },
      { id: "opt_4_2", label: "Entre 300 € et 1 000 € par mois", value: "Option B" },
      { id: "opt_4_3", label: "Plus de 1 000 € par mois", value: "Option C" },
    ],
  },
  {
    id: "step_5",
    title: "La maturité de votre projet actuel",
    options: [
      { id: "opt_5_1", label: "J'ai un projet d'investissement précis en tête", value: "Option A" },
      {
        id: "opt_5_2",
        label: "J'ai des objectifs clairs mais je ne sais pas par quel levier commencer",
        value: "Option B",
      },
      {
        id: "opt_5_3",
        label: "Je souhaite simplement optimiser ma situation fiscale globale",
        value: "Option C",
      },
    ],
  },
];

export function FunnelDiagnostic({ onBack }: FunnelDiagnosticProps) {
  const [stepsConfig, setStepsConfig] = useState<FunnelStep[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  type Phase = "loading" | "question" | "result_qualified" | "result_disqualified";
  const [phase, setPhase] = useState<Phase>("loading");
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

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
        .eq("tenant_id", "sylk-conseils")
        .eq("key", "default")
        .single();

      const steps = !error && data?.config?.steps ? data.config.steps : DEFAULT_STEPS;
      setStepsConfig(steps);
      setCurrentStepId(steps[0].id);
      setPhase("question");
      setLoadingConfig(false);
    };

    fetchConfig();

    const channel = supabase
      .channel("schema-db-changes-funnel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "funnel_config" },
        (payload) => {
          if (payload.new.key === "default" && payload.new.config?.steps) {
            setStepsConfig(payload.new.config.steps);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const syncStepToAdmin = (stepNumber: number, newAnswers: any) => {
    if (sessionId) {
      fetch("/api/funnel/sync-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          tenantId: "sylk-conseils",
          step: stepNumber,
          answers: newAnswers,
        }),
      }).catch(() => {});
    }
  };

  const handleAnswer = (option: FunnelOption) => {
    if (!currentStepId) return;
    const currentStepIndex = stepsConfig.findIndex((s) => s.id === currentStepId);
    const currentStep = stepsConfig[currentStepIndex];
    const newAnswers = { ...answers, [currentStep.id]: option.value };
    setAnswers(newAnswers);
    syncStepToAdmin(currentStepIndex + 2, newAnswers);
    const nextAction = option.nextStepId;

    if (nextAction === "end_qualified") {
      submitToN8N(newAnswers, true);
    } else if (nextAction === "end_disqualified") {
      submitToN8N(newAnswers, false);
    } else if (nextAction) {
      setCurrentStepId(nextAction);
    } else {
      if (currentStepIndex + 1 < stepsConfig.length) {
        setCurrentStepId(stepsConfig[currentStepIndex + 1].id);
      } else {
        submitToN8N(newAnswers, true);
      }
    }
  };

  const submitToN8N = (finalAnswers: Record<string, string>, isQualified: boolean) => {
    fetch("/api/funnel/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        tenantId: "sylk-conseils",
        result: isQualified ? "qualified" : "disqualified",
        answers: finalAnswers,
      }),
    }).catch(() => {});
    syncStepToAdmin(6, finalAnswers);
    if (isQualified) {
      const calendlyUrl =
        process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/sylk-conseils/30min";
      window.location.href = calendlyUrl;
    } else {
      setPhase("result_disqualified");
    }
  };

  const renderQuestion = () => {
    const stepObj = stepsConfig.find((s) => s.id === currentStepId);
    if (!stepObj) return null;
    const currentIndex = stepsConfig.findIndex((s) => s.id === currentStepId);

    return (
      <motion.div
        key={`q-${stepObj.id}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-[700px] w-full mx-auto"
      >
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-deep-500 mb-6 shadow-sm">
            Étape {currentIndex + 1} sur {stepsConfig.length}
          </div>
          <p className="text-deep-700/70 text-base md:text-lg leading-relaxed font-light mb-8 max-w-[600px] mx-auto md:mx-0">
            Pour concevoir des solutions parfaitement adaptées à votre profil, ce court diagnostic
            permet de poser les fondations de notre futur échange.
          </p>
        </div>
        <h3 className="text-2xl md:text-3xl font-light text-deep-800 mb-10 leading-tight text-center md:text-left">
          {stepObj.title}
        </h3>
        <div className="flex flex-col gap-4">
          {stepObj.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt)}
              disabled={isSubmitting}
              className="w-full text-left glass hover:bg-white/80 border border-border hover:border-deep-300 text-deep-800 px-6 py-5 rounded-2xl transition-all duration-300 font-light flex items-center justify-between group disabled:opacity-60"
            >
              <span className="text-base md:text-lg text-deep-800">{opt.label}</span>
              <div className="w-5 h-5 rounded-full border border-deep-300 group-hover:border-deep-500 flex items-center justify-center transition-colors shrink-0 ml-4">
                <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-deep-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderResult = (isQualified: boolean) => {
    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[600px] w-full mx-auto text-center"
      >
        {isQualified ? (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-8 mx-auto">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-deep-800 mb-6">
              Votre démarche est validée
            </h2>
            <p className="text-deep-700/70 text-lg leading-relaxed font-light mb-8">
              Redirection vers notre calendrier de rendez-vous…
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-8 mx-auto">
              <ShieldCheck size={40} className="text-deep-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-deep-800 mb-6">
              Merci pour votre démarche
            </h2>
            <p className="text-deep-700/70 text-lg leading-relaxed font-light mb-12">
              Les éléments transmis indiquent que votre situation actuelle ne correspond pas aux
              structures d&apos;optimisation sur-mesure que nous déployons actuellement. Nous vous
              remercions pour l&apos;intérêt porté à SYLK Conseils.
            </p>
            <button
              onClick={onBack}
              className="w-full sm:w-auto mx-auto glass-strong text-deep-800 px-10 py-[1.125rem] rounded-full inline-flex items-center justify-center gap-3 font-medium hover:bg-white/90 transition-all duration-300 active:scale-95"
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
      <div className="mesh-container flex flex-col w-full min-h-screen items-center justify-center px-6">
        <MeshBackground />
        <Loader2 size={24} className="text-deep-400 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="mesh-container flex flex-col w-full min-h-screen items-center justify-center px-6 py-24 md:py-32"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <MeshBackground />

      <div className="relative z-10 w-full mt-8 md:mt-0">
        <AnimatePresence mode="wait">
          {phase === "question" && renderQuestion()}
          {phase === "result_qualified" && renderResult(true)}
          {phase === "result_disqualified" && renderResult(false)}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
