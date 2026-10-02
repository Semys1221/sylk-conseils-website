"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";

export function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative flex flex-col min-h-screen w-full overflow-hidden bg-slate-950"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-8 pb-16 justify-end lg:items-center lg:justify-center">
        <div className="lg:max-w-xl lg:mx-auto lg:text-center">
          <div className="flex flex-col items-start gap-3 mt-auto lg:items-center">
            <div className="flex items-center gap-3 mb-1">
              <img
                src={FUNNEL_LOGO_URL}
                alt="SYLK Conseils"
                className="w-9 h-9 rounded-full ring-1 ring-white/20"
              />
              <span className="text-white/90 font-semibold text-sm tracking-wide uppercase">
                SYLK Conseils
              </span>
            </div>
            <h1 className="heading-3 text-white font-bold leading-tight text-balance">
              Votre cabinet
              <br />
              <span className="text-blue-300">digitalisé.</span>
            </h1>
          </div>

          <button
            onClick={onContinue}
            className="mt-10 w-full lg:max-w-sm lg:mx-auto rounded-2xl bg-blue-500 hover:bg-blue-400 active:scale-[0.97] text-white font-semibold text-base py-4 transition-all duration-200 shadow-[0_8px_32px_rgba(59,130,246,0.45)] tracking-wide"
          >
            Continuer
          </button>
        </div>
        <div className="h-safe-bottom lg:hidden" />
      </div>
    </motion.div>
  );
}
