"use client";

import { Maximize } from "lucide-react";

interface IntroStepProps {
  onContinue: () => void;
}

export function IntroStep({ onContinue }: IntroStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
        <Maximize size={24} className="text-blue-600 dark:text-blue-300" />
      </div>
      <h1 className="text-3xl md:text-4xl font-light tracking-tight text-slate-700 dark:text-white/90 max-w-md">
        Une fois dans la réunion, cliquez sur <span className="font-medium">Plein écran</span> pour activer
      </h1>
      <p className="text-sm text-slate-400 dark:text-white/50 max-w-xs">
        Appuyez sur <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/60 text-xs font-mono">Echap</kbd> pour quitter le mode plein écran
      </p>
      <button
        onClick={onContinue}
        className="mt-4 px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/25"
      >
        Rejoindre la réunion
      </button>
    </div>
  );
}
