"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { LoginPhoneLoading } from "@/components/login-phone-loading";
import { WelcomeStep } from "@/components/login-welcome";
import { useLoginFlowStore } from "@/lib/login-flow-store";

const LOGO =
  "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png";

function InstallStep({ onContinue, onInstall }: { onContinue: () => void; onInstall: () => void }) {
  return (
    <motion.div
      key="install"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6 px-6"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <div className="w-24 h-24 rounded-[1.4rem] bg-gradient-to-br from-blue-950 to-cyan-950 border border-slate-700/50 shadow-[0_0_40px_rgba(8,47,73,0.5)] flex items-center justify-center overflow-hidden">
          <img src={LOGO} alt="SYLK Conseils" className="w-16 h-16 object-cover rounded-full" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        className="text-white font-serif text-xl tracking-wider"
      >
        SYLK Conseils
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        className="text-slate-400 text-sm text-center max-w-xs"
      >
        Votre tableau de bord patrimonial
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
        onClick={onInstall}
        className="mt-4 px-10 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-shadow active:scale-95 flex items-center gap-2"
      >
        <ArrowUpRight size={18} />
        Ajouter à l&apos;écran d&apos;accueil
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onClick={onContinue}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4"
      >
        Continuer sans installer
      </motion.button>
    </motion.div>
  );
}

export default function ApplicationPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "install" | "welcome">("loading");
  const loadingComplete = useLoginFlowStore((s) => s.loadingComplete);
  const setLoadingComplete = useLoginFlowStore((s) => s.setLoadingComplete);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  // Hydration fix — skip loading if already seen
  useEffect(() => {
    if (loadingComplete) setPhase("install");
  }, [loadingComplete]);

  // PWA install handlers
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const installedHandler = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.accepted) setInstalled(true);
      setDeferredPrompt(null);
    } else {
      alert(
        "Pour ajouter SYLK Conseils à votre écran d'accueil :\n\n" +
          "• Sur iPhone/iPad : tapotez Partager (icône carré avec flèche) → 'Ajouter à l'écran d'accueil'\n" +
          "• Sur Chrome Android : menu ⋮ → 'Ajouter à l'écran d'accueil'\n" +
          "• Sur desktop Chrome : icône ⊕ dans la barre d'adresse → 'Installer'"
      );
    }
  }, [deferredPrompt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 overflow-hidden relative">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <div className="flex items-center justify-center p-6 min-h-screen">
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <LoginPhoneLoading
                onComplete={() => {
                  setLoadingComplete(true);
                  setPhase("install");
                }}
              />
            </motion.div>
          </div>
        )}

        {phase === "install" && (
          <div className="flex items-center justify-center p-6 min-h-screen">
            <InstallStep onInstall={handleInstall} onContinue={() => setPhase("welcome")} />
          </div>
        )}

        {phase === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <WelcomeStep onContinue={() => router.push("/admin")} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {installed && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow-lg flex items-center gap-2"
          >
            <ArrowUpRight size={16} />
            Application installée avec succès
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
