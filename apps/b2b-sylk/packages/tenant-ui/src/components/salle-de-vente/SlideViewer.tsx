"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTenant } from "../../tenant-config";
import type { Slide } from "../../tenant-config";
import { AlertTriangle } from "lucide-react";

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 0,
    tag: "Bienvenue",
    title: "Votre avenir financier commence aujourd'hui",
    subtitle: "Une session dédiée à structurer, avec précision, l'architecture de vos succès.",
    accent: "from-blue-600/20 to-indigo-600/10",
    icon: "◈",
  },
  {
    id: 1,
    tag: "Le Constat",
    title: "La pression fiscale n'est pas une fatalité",
    subtitle:
      "Face à une imposition étouffante, trop de dirigeants subissent au lieu de piloter. Il existe des leviers légaux puissants — encore faut-il les connaître.",
    accent: "from-red-600/15 to-orange-600/10",
    icon: "⊘",
  },
  {
    id: 2,
    tag: "Méthodologie",
    title: "L'approche Sylk en 3 temps",
    subtitle:
      "Diagnostic patrimonial → Ingénierie sur-mesure → Mise en œuvre & suivi. Chaque étape est calibrée pour votre profil unique.",
    accent: "from-emerald-600/15 to-teal-600/10",
    icon: "⬡",
  },
  {
    id: 3,
    tag: "Les Leviers",
    title: "Vos instruments d'optimisation",
    subtitle:
      "Holding patrimoniale · PEA & PEA-PME · Assurance-vie luxembourgeoise · SCPI · Démembrement de propriété. Chaque levier est activé au bon moment.",
    accent: "from-violet-600/15 to-purple-600/10",
    icon: "⟡",
  },
  {
    id: 4,
    tag: "Votre Situation",
    title: "Ce que nous avons identifié pour vous",
    subtitle:
      "Au vu de votre profil, plusieurs axes d'optimisation immédiats sont à notre portée. Nous allons les passer en revue ensemble.",
    accent: "from-amber-600/15 to-yellow-600/10",
    icon: "◎",
  },
  {
    id: 5,
    tag: "Prochaines Étapes",
    title: "Un plan d'action clair et daté",
    subtitle:
      "À l'issue de cette session, vous repartez avec un plan structuré, des priorités définies et les prochaines actions concrètes à engager.",
    accent: "from-blue-500/20 to-cyan-500/10",
    icon: "→",
  },
];

interface SlideViewerProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  slides?: Slide[];
}

export function SlideViewer({ currentSlide, onSlideChange, slides }: SlideViewerProps) {
  const tenant = useTenant();
  const SLIDES: Slide[] = slides ?? tenant.slides ?? DEFAULT_SLIDES;
  const [pusherReady, setPusherReady] = useState(true);
  const [pusherError, setPusherError] = useState(false);

  const handleSlideChange = useCallback(
    (index: number) => {
      onSlideChange(index);
    },
    [onSlideChange]
  );

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu";
    const channelId = process.env.NEXT_PUBLIC_PUSHER_CHANNEL_ID ?? "sylk-conseils";

    if (!pusherKey || pusherKey === "not-set") {
      setPusherReady(false);
      return;
    }

    setPusherReady(true);
    let cleanup: (() => void) | undefined;

    import("pusher-js")
      .then((PusherJS) => {
        const pusher = new PusherJS.default(pusherKey, { cluster: pusherCluster });
        const channel = pusher.subscribe(channelId);
        channel.bind("slide-change", (data: { slideIndex: number }) => {
          handleSlideChange(data.slideIndex);
        });
        cleanup = () => {
          channel.unbind_all();
          pusher.unsubscribe(channelId);
          pusher.disconnect();
        };
      })
      .catch(() => {
        setPusherError(true);
      });

    return () => cleanup?.();
  }, [handleSlideChange]);

  const slide = SLIDES[currentSlide] ?? SLIDES[0];

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      {!pusherReady && (
        <div className="absolute top-4 right-4 z-30 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle size={10} />
          Mode hors-ligne
        </div>
      )}
      {pusherError && (
        <div className="absolute top-4 right-4 z-30 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle size={10} />
          Erreur synchro
        </div>
      )}

      <div className="flex items-center gap-1.5 px-8 pt-6 pb-0">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
              i === currentSlide
                ? "bg-[#8cb4e6]"
                : i < currentSlide
                  ? "bg-[#8cb4e6]/30"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex-1 flex flex-col items-start justify-center px-8 lg:px-16 py-12"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slide.accent} pointer-events-none`}
          />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-8">
              {slide.tag}
            </div>

            <div className="text-6xl lg:text-8xl text-white/5 font-light mb-4 leading-none select-none">
              {slide.icon}
            </div>

            <h2 className="text-2xl lg:text-4xl font-light text-white leading-tight tracking-tight mb-6">
              {slide.title}
            </h2>
            <p className="text-slate-300/80 text-base lg:text-lg font-light leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="mt-10 text-xs text-slate-600 font-mono">
              {String(currentSlide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
