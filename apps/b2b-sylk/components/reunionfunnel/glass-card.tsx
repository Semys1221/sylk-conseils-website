"use client";

import type { FlowStep } from "./store";

interface GlassCardProps {
  children: React.ReactNode;
  currentStep: FlowStep;
}

const stepLabels: Record<FlowStep, string> = {
  welcome: "BIENVENUE",
  config: "CONFIGURATION",
  intro: "CONFIGURATION",
  meeting: "DIRECT",
};

export function GlassCard({ children, currentStep }: GlassCardProps) {
  return (
    <div className="relative z-30 w-[92vw] sm:w-[80vw] md:w-[60vw] max-w-3xl min-h-[70dvh] flex flex-col">
      <div className="w-full rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-[15px] border border-slate-200 dark:border-white/15 shadow-2xl flex flex-col p-5 sm:p-6 md:p-8">
        <div className="absolute top-4 right-5 text-[10px] font-mono text-slate-400 dark:text-white/30 tracking-widest">
          {stepLabels[currentStep]}
        </div>
        {children}
      </div>
    </div>
  );
}
