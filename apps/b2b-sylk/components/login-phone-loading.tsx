"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";

export function LoginPhoneLoading({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Phone frame */}
          <div className="relative w-[260px] h-[520px] rounded-[2.5rem] border border-slate-700/50 bg-slate-900 shadow-[0_0_80px_rgba(8,47,73,0.4)] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-28 h-6 rounded-b-xl bg-black" />
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20 w-2 h-2 rounded-full bg-slate-800" />

            {/* Screen content — loading */}
            <div className="h-full bg-slate-950 p-3 pt-12 flex flex-col items-center relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-cyan-600/8 blur-2xl pointer-events-none" />

              {/* Logo */}
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)] mb-4">
                <img src={FUNNEL_LOGO_URL} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Loading text */}
              <p className="text-[7px] text-slate-400 font-medium tracking-wide mb-6">
                Chargement de votre espace...
              </p>

              {/* Loading bar */}
              <div className="w-3/4 h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4.5, ease: "easeInOut" }}
                  onAnimationComplete={onComplete}
                />
              </div>

              {/* Version footer */}
              <p className="text-[5px] text-slate-700 text-center mt-auto pb-1">
                SYLK Conseils v2.4.1
              </p>
            </div>
          </div>

          {/* Glow behind phone */}
          <div className="absolute -inset-4 rounded-[3rem] bg-blue-500/5 blur-3xl -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
