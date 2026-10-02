"use client";

import Image from "next/image";

const AVATAR_URL =
  "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative shrink-0">
          <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur-md" />
          <Image
            src={AVATAR_URL}
            alt="SYLK Conseils"
            width={40}
            height={40}
            className="relative rounded-full ring-2 ring-blue-400/40"
            priority
          />
        </div>
        <span className="text-lg font-medium text-slate-700 dark:text-white/80 tracking-wide">
          SYLK Conseils
        </span>
      </div>
      <h1 className="text-xl sm:text-2xl md:text-5xl font-light tracking-tight text-slate-700 dark:text-white/90 max-w-lg break-words hyphens-auto">
        Ravi de vous retrouver pour faire le point sur votre situation et vos objectifs.
      </h1>
      <button
        onClick={onContinue}
        className="mt-4 px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/25"
      >
        Continuer
      </button>
    </div>
  );
}
