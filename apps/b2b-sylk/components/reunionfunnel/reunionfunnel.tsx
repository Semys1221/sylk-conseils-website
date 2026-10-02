"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useFlowStore } from "./store";
import { GlassCard } from "./glass-card";
import { WelcomeStep } from "./welcome-step";
import { IntroStep } from "./intro-step";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";

const ConfigStep = dynamic(() => import("./config-step").then((m) => m.ConfigStep), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
    </div>
  ),
});

const MeetingRoom = dynamic(() => import("./meeting-room").then((m) => m.MeetingRoom), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
    </div>
  ),
});

export function ReunionFunnel() {
  const step = useFlowStore((s) => s.step);
  const advance = useFlowStore((s) => s.advance);
  const streamRef = useRef<MediaStream | null>(null);
  const [date, setDate] = useState("");
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const applyTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleDark = useCallback(() => {
    const next = !isDark;
    applyTheme(next);
    fetch("/api/reunion/theme-toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDark: next, channelId: "sylk-conseils" }),
    }).catch(() => {});
  }, [isDark, applyTheme]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setDate(
        now
          .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
          .toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleContinue = useCallback(async () => {
    if (step === "welcome") {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = s;
      } catch {
        console.warn("Permission caméra/micro refusée ou indisponible");
      }
    }
    advance();
  }, [advance, step]);

  return (
    <div className="h-dvh w-full overflow-hidden relative">
      {/* Light background — misty slate/blue */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      />

      {/* Dark background — slate */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #64748b 0%, #1e293b 50%, #0f172a 100%)",
        }}
      />

      {/* ===== Peripheral Elements ===== */}

      {/* Top Left — Brand */}
      <div className="fixed top-8 left-8 z-40 hidden md:flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src={FUNNEL_LOGO_URL}
            alt="SYLK Conseils"
            width={28}
            height={28}
            className="rounded-full ring-1 ring-slate-400/30 dark:ring-white/20 group-hover:ring-slate-400/60 dark:group-hover:ring-white/40 transition-all"
            priority
          />
          <span className="text-sm font-serif font-normal tracking-widest text-slate-400 dark:text-white/80 group-hover:text-slate-600 dark:group-hover:text-white transition-colors">
            SYLK Conseils
          </span>
        </Link>
      </div>

      {/* Left Center — Navigation */}
      <div className="fixed top-28 left-8 z-40 hidden md:flex flex-col gap-5">
        <a
          href="https://sylkconseils.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white/80 transition-colors"
        >
          Accueil
        </a>
        <a
          href="https://sylkconseils.com/expertises"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white/80 transition-colors"
        >
          Services
        </a>
        <a
          href="https://sylkconseils.com/le-cabinet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white/80 transition-colors"
        >
          Conseil
        </a>
        <a
          href="https://sylkconseils.com/consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white/80 transition-colors"
        >
          Contact
        </a>
      </div>

      {/* Bottom Left — Info */}
      <div className="fixed bottom-8 left-8 z-40 max-w-[200px] hidden md:block">
        <p className="text-[10px] uppercase leading-relaxed text-slate-400 dark:text-white/30 tracking-wider">
          Optimisation fiscale, préparation de la retraite & transmission dans les meilleures
          conditions
        </p>
      </div>

      {/* Top Right — Time, Date, Toggles */}
      <div className="fixed top-8 right-8 z-40 hidden md:flex flex-col items-end gap-2">
        {date && (
          <span className="text-[10px] font-mono text-slate-400 dark:text-white/40 tracking-widest">
            {date}
          </span>
        )}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={toggleDark}
            className="w-7 h-7 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white/80 hover:border-slate-400 dark:hover:border-white/40 transition-all"
          >
            <Moon size={12} />
          </button>
          <button
            onClick={toggleDark}
            className="w-7 h-7 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-400 dark:text-white/50 hover:text-slate-600 dark:hover:text-white/80 hover:border-slate-400 dark:hover:border-white/40 transition-all"
          >
            <Sun size={12} />
          </button>
        </div>
      </div>

      {/* Bottom Right — Copyright */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-slate-400 dark:text-white/30 tracking-wider">
          &copy; 2026 SYLK CONSEILS
        </span>
        <span className="text-[10px] text-slate-400 dark:text-white/30 tracking-wider">
          LINKEDIN
        </span>
      </div>

      {/* ===== Glass Card (centered) ===== */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <GlassCard currentStep={step}>
          {step !== "meeting" ? (
            <div key={step} className="animate-slide-in flex-1 flex">
              {step === "welcome" && <WelcomeStep onContinue={handleContinue} />}
              {step === "config" && <ConfigStep stream={streamRef.current} onContinue={handleContinue} />}
              {step === "intro" && <IntroStep onContinue={handleContinue} />}
            </div>
          ) : (
            <MeetingRoom />
          )}
        </GlassCard>
      </div>
    </div>
  );
}
