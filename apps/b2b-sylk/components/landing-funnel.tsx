"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Linkedin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Testimonials } from "@workspace/tenant-ui";
import tenantConfig from "@/tenant.config";
import { FunnelFlow } from "@/components/funnel-flow/funnel-flow";
import { useFunnelOverlayStore } from "@/lib/funnel-store";
import type { HomePageContent } from "@/lib/cms/schema";
import type { ResolvedHomeMedia } from "@/lib/cms/resolve-media";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeUpStagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function LandingFunnel({
  content,
  media,
  calendlyUrl,
}: {
  content: HomePageContent;
  media: ResolvedHomeMedia;
  calendlyUrl: string;
}) {
  const [showFunnel, setShowFunnel] = useState(false);
  const setOnClose = useFunnelOverlayStore((s) => s.setOnClose);

  const closeFunnel = useCallback(() => setShowFunnel(false), []);

  const handleClick = useCallback(() => setShowFunnel(true), []);

  useEffect(() => {
    setOnClose(closeFunnel);
    return () => setOnClose(null);
  }, [closeFunnel, setOnClose]);

  useEffect(() => {
    document.body.style.overflow = showFunnel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFunnel]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!showFunnel && (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-white"
          >
            {/* HERO */}
            <section className="-mt-16 pt-16 grid grid-cols-1 lg:grid-cols-2 min-h-[100svh] bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#1e3a8a]">
              <div className="relative w-full h-[50vh] lg:h-auto overflow-hidden">
                <Image
                  src={media.heroPortraitUrl}
                  alt="Stéphane Lawnicki"
                  fill
                  priority
                  className="object-cover object-[center_20%]"
                  referrerPolicy="no-referrer"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 lg:via-transparent to-[#0a0a0f]/20 lg:bg-gradient-to-t lg:from-[#0a0a0f]/60" />
                <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-20 max-w-[80%]">
                  <div className="text-small tracking-[0.2em] font-mono text-white/70 uppercase mb-1 drop-shadow-md">
                    {content.hero.imageLabel}
                  </div>
                  <p className="text-small text-white/80 tracking-wide drop-shadow-md leading-relaxed">
                    {content.hero.founderLine}
                  </p>
                </div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="w-full bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#1e3a8a] text-white flex flex-col justify-center px-6 xs:px-8 sm:px-12 lg:px-16 xl:px-24 py-16 lg:py-20 pt-20 lg:pt-24 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-lg lg:max-w-xl mx-auto lg:mx-0">
                  <div className="flex items-center gap-2 mb-8 lg:mb-10 w-fit bg-gradient-to-r from-[#0C1F3E]/60 to-[#0A66C2]/15 border border-[#0A66C2]/30 rounded-full px-4 py-2 lg:px-5 lg:py-2.5 shadow-[0_4px_30px_rgba(10,102,194,0.15)] backdrop-blur-md">
                    <span className="flex items-center justify-center bg-[#0A66C2] rounded-full w-4 h-4 lg:w-5 lg:h-5 shrink-0">
                      <svg
                        className="w-2 h-2 lg:w-2.5 lg:h-2.5 fill-white"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </span>
                    <span className="text-small font-semibold tracking-widest text-[#93C5FD] uppercase">
                      {content.hero.linkedinBadge}
                    </span>
                  </div>

                  <h1 className="heading-1 font-extralight tracking-tight mb-6 lg:mb-8 leading-[1.15]">
                    {content.hero.titleLine1}
                    <br />
                    <span className="font-serif italic text-blue-300 font-normal">
                      {content.hero.titleLine2}
                    </span>
                  </h1>

                  <p className="text-lead text-slate-300 mb-10 lg:mb-12">{content.hero.subtitle}</p>

                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-4">
                    <button
                      onClick={handleClick}
                      className="flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 transition-all text-black rounded-full px-6 py-3.5 text-sm font-medium shadow-[0_4px_20px_rgba(255,255,255,0.1)] w-full xs:w-auto hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="bg-black text-white p-1.5 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                        <Calendar size={12} className="text-white" />
                      </div>
                      {content.hero.ctaVideo}
                    </button>
                    <a
                      href={tenantConfig.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-all text-white rounded-full px-6 py-3.5 text-sm font-medium border border-white/20 backdrop-blur-md w-full xs:w-auto"
                    >
                      <Linkedin size={16} className="text-[#0A66C2] fill-[#0A66C2]/10 shrink-0" />
                      {content.hero.ctaLinkedin}
                      <ArrowRight size={14} className="opacity-80 shrink-0" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* CABINET */}
            <section className="py-24 lg:py-32 px-6 flex flex-col items-center text-center bg-gradient-to-b from-white to-[#F8F9FA] relative overflow-hidden">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 lg:w-96 h-72 lg:h-96 bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

              <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
                <div className="flex items-center gap-2 text-small font-semibold tracking-widest text-slate-400 uppercase mb-6 xs:mb-8">
                  <span className="text-lead leading-none">◇</span> {content.cabinetSection.label}
                </div>

                <h2 className="heading-2 font-light text-[#1A1A1A] tracking-tight leading-[1.1] mb-16">
                  {content.cabinetSection.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center text-left w-full">
                  <div className="lg:col-span-2 space-y-6">
                    <p className="text-lead text-slate-600 block leading-relaxed">
                      {content.cabinetSection.paragraph1}
                    </p>
                    <div className="h-px w-12 bg-slate-200"></div>
                    <p className="text-small text-slate-500 block leading-relaxed">
                      {content.cabinetSection.paragraph2}
                    </p>
                    <Link
                      href="/le-cabinet"
                      className="inline-flex items-center gap-3 bg-[#111111] hover:bg-black transition-all text-white rounded-full pl-6 pr-2 py-2 text-sm font-medium group mt-4"
                    >
                      {content.cabinetSection.cta}
                      <div className="bg-white text-black p-1.5 rounded-full transition-transform group-hover:translate-x-1">
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  </div>

                  <div className="lg:col-span-3 grid grid-cols-2 gap-4 lg:gap-6">
                    {content.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="heading-2 font-light text-[#1A1A1A] mb-3">{stat.value}</div>
                        <div className="text-small text-slate-500 font-light">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* EXPERTISE */}
            <section className="px-4 lg:px-8 max-w-[1600px] mx-auto mb-20 lg:mb-32">
              <div className="relative h-[500px] lg:h-[700px] rounded-[32px] overflow-hidden lg:rounded-[56px] bg-[#1a202c]">
                <Image
                  src={media.expertiseBannerImageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover object-top opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/90 via-[#050B14]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050B14]/60 via-[#050B14]/20 lg:via-transparent to-transparent" />
                <div className="absolute inset-0 p-6 xs:p-8 lg:p-16 flex flex-col lg:flex-row justify-end lg:justify-between lg:items-end z-10 pb-8 xs:pb-12 lg:pb-16">
                  <h3 className="heading-1 text-white font-light tracking-tight leading-[1.05] mb-6 lg:mb-0 max-w-xl">
                    {content.expertiseBanner.title.split("\n").map((line, i, arr) => (
                      <span key={line}>
                        {line}
                        {i < arr.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h3>
                  <div className="lg:max-w-sm lg:ml-12 backdrop-blur-md bg-black/20 p-6 lg:p-0 rounded-2xl lg:bg-transparent border border-white/5 lg:border-none">
                    <p className="text-lead text-white/80 leading-relaxed mb-6 lg:mb-8">
                      {content.expertiseBanner.description}
                    </p>
                    <Link
                      href="/expertises/fiscalite"
                      className="flex items-center gap-3 bg-white text-black hover:bg-gray-100 transition-all rounded-full pl-6 pr-2 py-2 text-sm font-medium w-fit group"
                    >
                      {content.expertiseBanner.cta}
                      <div className="bg-black text-white p-1.5 rounded-full transition-transform group-hover:translate-x-1">
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <Testimonials />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Funnel overlay */}
      <AnimatePresence>
        {showFunnel && (
          <motion.div
            key="funnel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50"
          >
            <FunnelFlow media={media} calendlyUrl={calendlyUrl} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
