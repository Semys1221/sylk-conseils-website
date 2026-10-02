"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Globe,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAdminStore } from "@workspace/tenant-ui";

/* ── Step definitions ────────────────────────────────────────── */
const STEPS = [
  {
    step: 1,
    icon: LayoutDashboard,
    label: "Tableau de bord",
    color: "from-blue-600 to-cyan-500",
    glow: "rgba(37,99,235,0.35)",
    title: "Votre vue d'ensemble",
    description:
      "Suivez en temps réel votre encours actuel, vos revenus en cours et le flux d'activité récent — visites, leads entrants, rendez-vous confirmés.",
    highlights: ["Encours actuel 4 000 000 €", "Leads du jour", "Activité récente"],
  },
  {
    step: 2,
    icon: Globe,
    label: "Site Web",
    color: "from-violet-600 to-blue-500",
    glow: "rgba(109,40,217,0.35)",
    title: "Analyse de trafic",
    description:
      "Consultez les pages vues, sessions et tendances d'audience sur 30 jours via PostHog. Identifiez vos pics de trafic et optimisez votre acquisition.",
    highlights: ["Pages vues & sessions", "Tendances 30 jours", "Données PostHog live"],
  },
  {
    step: 3,
    icon: TrendingUp,
    label: "Pipeline",
    color: "from-emerald-600 to-teal-500",
    glow: "rgba(5,150,105,0.35)",
    title: "Campagnes SmartLead",
    description:
      "Suivez les statistiques live de vos campagnes d'e-mailing — taux d'ouverture, de clic et de réponse. Gérez et comparez vos campagnes en un coup d'œil.",
    highlights: ["Taux ouverture / clic", "Taux de réponse", "Gestion des campagnes"],
  },
  {
    step: 4,
    icon: Calendar,
    label: "Rendez-vous",
    color: "from-orange-500 to-amber-400",
    glow: "rgba(234,88,12,0.35)",
    title: "Agenda Calendly",
    description:
      "Visualisez votre calendrier à venir, consultez l'historique des 7 derniers jours et suivez les statuts de vos rendez-vous — confirmés ou annulés.",
    highlights: ["Calendrier à venir", "Historique 7 jours", "Confirmations / annulations"],
  },
] as const;

/* ── Component ───────────────────────────────────────────────── */
export function OnboardingOverlay() {
  const { onboardingComplete, setOnboardingComplete } = useAdminStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  // Avoid SSR mismatch — don't render until hydrated
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || onboardingComplete) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  const navigate = (dir: "forward" | "back") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => (dir === "forward" ? prev + 1 : prev - 1));
      setAnimating(false);
    }, 220);
  };

  const finish = () => {
    setOnboardingComplete(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-end"
      style={{ isolation: "isolate" }}
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" aria-hidden />

      {/* Background image (same as login) blurred heavily */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110"
        style={{ backgroundImage: "url('/login-bg.png')" }}
        aria-hidden
      />

      {/* Sheet panel — slides up from bottom */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative z-10 w-full max-w-md px-4 pb-10"
      >
        <div className="rounded-3xl bg-slate-950/90 border border-slate-800/60 shadow-[0_-8px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Step card */}
          <div
            className="p-7 transition-all duration-200 ease-out"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? direction === "forward"
                  ? "translateX(20px)"
                  : "translateX(-20px)"
                : "translateX(0)",
            }}
          >
            {/* Icon bubble */}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}
              style={{ boxShadow: `0 8px 24px ${step.glow}` }}
            >
              <Icon size={26} className="text-white" />
            </div>

            {/* Step counter badge */}
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1 block">
              Étape {step.step} / {STEPS.length} — {step.label}
            </span>

            {/* Title */}
            <h2 className="heading-4 text-white font-bold tracking-tight mb-3 text-balance m-0">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed mb-5">{step.description}</p>

            {/* Highlights */}
            <ul className="flex flex-col gap-2">
              {step.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}
                  >
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </span>
                  <span className="text-slate-300 text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-800/60 mx-6" />

          {/* Footer — dots + navigation */}
          <div className="flex items-center justify-between px-7 py-5">
            {/* Dots — display only, no jumping */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? `w-5 h-2 bg-gradient-to-r ${step.color}`
                      : i < currentStep
                        ? "w-2 h-2 bg-slate-500"
                        : "w-2 h-2 bg-slate-700"
                  }`}
                  aria-label={`Étape ${i + 1}`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={() => navigate("back")}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-all duration-200 active:scale-90"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {isLast ? (
                <button
                  onClick={finish}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-br ${step.color} text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:opacity-90 active:scale-95`}
                  style={{ boxShadow: `0 4px 20px ${step.glow}` }}
                >
                  <Check size={15} strokeWidth={2.5} />
                  Terminer
                </button>
              ) : (
                <button
                  onClick={() => navigate("forward")}
                  className={`flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-br ${step.color} text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:opacity-90 active:scale-95`}
                  style={{ boxShadow: `0 4px 20px ${step.glow}` }}
                >
                  Suivant
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
