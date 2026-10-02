"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { VolumeX, Calendar } from "lucide-react";
import tenantConfig from "@/tenant.config";
import { useFunnelOverlayStore } from "@/lib/funnel-store";
import { useFlowStore } from "./store";
import { GlassCard } from "./glass-card";
import { QualificationForm } from "./qualification-form";

const VIDEO_URL =
  "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/video-cgp-O0OlUjKJ9a3ANp5QObDKMsVvd56zvz.mp4";
const POSTER_URL =
  "https://image.mux.com/601I74ydXCKONbHE02Sz00NPIYZJNk6usdBL00q77FwUkvw/thumbnail.jpg";

const slideLeft = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export function FunnelFlow() {
  const step = useFlowStore((s) => s.step);
  const advance = useFlowStore((s) => s.advance);
  const setStep = useFlowStore((s) => s.setStep);
  const reset = useFlowStore((s) => s.reset);
  const setCalendlyEvent = useFlowStore((s) => s.setCalendlyEvent);
  const onClose = useFunnelOverlayStore((s) => s.onClose);
  const handleClose = useCallback(() => {
    reset();
    onClose?.();
  }, [onClose, reset]);

  const [videoEnded, setVideoEnded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showSound, setShowSound] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [calendlyBookingDone, setCalendlyBookingDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const calendlyRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      setVideoProgress(video.currentTime);
      setVideoDuration(video.duration || 0);
      if (video.duration > 0 && video.currentTime >= video.duration - 1) {
        video.pause();
        setVideoEnded(true);
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, []);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setVideoEnded(true);
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleContinue = useCallback(() => {
    setTransitioning(true);
    window.location.href = tenantConfig.calendlyUrl;
  }, []);

  const handleBack = useCallback(() => {
    if (step === "welcome") {
      onClose?.();
    } else {
      const order = ["welcome", "calendly", "qualification"];
      const idx = order.indexOf(step);
      if (idx > 0) setStep(order[idx - 1] as typeof step);
    }
  }, [step, setStep, onClose]);

  useEffect(() => {
    if (step !== "calendly") return;
    setCalendlyBookingDone(false);
  }, [step]);

  useEffect(() => {
    if (step !== "welcome") {
      setTransitioning(false);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "calendly") return;
    setIframeReady(false);
  }, [step]);

  const handleIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  useEffect(() => {
    if (step !== "calendly") return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.event === "calendly.event_scheduled") {
        const { event_uri, invitee_uri } = e.data.payload ?? {};
        if (event_uri && invitee_uri) {
          setCalendlyEvent(event_uri, invitee_uri);
        }
        setCalendlyBookingDone(true);
        setTimeout(() => advance(), 800);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [step, advance, setCalendlyEvent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: pageLoaded ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-screen w-full overflow-hidden relative bg-slate-50"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      }}
    >
      {/* Back arrow */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={handleBack}
        className="fixed top-6 right-6 z-40 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-all shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Logo top-left */}
      <button
        onClick={handleClose}
        className="fixed top-6 left-6 z-40 hidden md:flex items-center gap-2.5 group"
      >
        <img
          src="https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png"
          alt="SYLK Conseils"
          className="w-7 h-7 rounded-full ring-1 ring-slate-400/30 group-hover:ring-slate-400/60 transition-all"
        />
        <span className="text-sm font-serif font-normal tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
          SYLK Conseils
        </span>
      </button>

      {/* Left Center — Navigation */}
      <div className="fixed top-28 left-6 z-40 hidden md:flex flex-col gap-4">
        <button
          onClick={handleClose}
          className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
        >
          Accueil
        </button>
        <a
          href="https://sylkconseils.com/expertises"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
        >
          Services
        </a>
        <a
          href="https://sylkconseils.com/le-cabinet"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
        >
          Conseil
        </a>
        <a
          href="https://sylkconseils.com/consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
        >
          Contact
        </a>
      </div>

      {/* Bottom Left — Info */}
      <div className="fixed bottom-8 left-6 z-40 max-w-[180px] hidden md:block">
        <p className="text-[10px] uppercase leading-relaxed text-slate-400 tracking-wider">
          Optimisation fiscale, préparation de la retraite &amp; transmission dans les meilleures
          conditions
        </p>
      </div>

      {/* Bottom Right — Copyright */}
      <div className="fixed bottom-8 right-6 z-40 hidden md:flex flex-col items-end gap-0.5">
        <button
          onClick={handleClose}
          className="text-[10px] text-slate-400 tracking-wider hover:text-slate-600 transition-colors"
        >
          &copy; 2026 SYLK CONSEILS
        </button>
        <a
          href={tenantConfig.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-400 tracking-wider hover:text-blue-600 transition-colors"
        >
          LINKEDIN
        </a>
      </div>

      {/* Glass Card */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <GlassCard>
          <AnimatePresence mode="wait">
            {/* Home — Mux Video */}
            {step === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col items-center text-center gap-3 p-2 overflow-y-auto h-full min-h-0"
              >
                {/* Video - vertical */}
                <div className="flex-1 flex justify-center min-h-0 w-full max-h-[45vh] sm:max-h-[55vh]">
                  <div className="relative h-full aspect-[9/16]">
                    {/* macOS shadow behind */}
                    <div className="absolute -inset-2 bg-black/5 blur-2xl rounded-2xl pointer-events-none" />

                    {/* Video wrapper */}
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      {/* Logo top-left */}
                      <button
                        onClick={handleClose}
                        className="absolute top-3 left-3 z-10 flex items-center gap-2"
                      >
                        <img
                          src="https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png"
                          alt="SYLK Conseils"
                          className="w-6 h-6 rounded-full ring-1 ring-white/40"
                        />
                        <span className="text-[10px] font-medium text-white/80 tracking-wide">
                          SYLK Conseils
                        </span>
                      </button>

                      {/* Decaying blur bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-10 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                      {/* Progress bar — top */}
                      <div className="absolute top-0 left-0 right-0 z-10 h-1 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-black/10" />
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1D92DD] to-[#1186D2] transition-[width] duration-200 shadow-[0_0_8px_rgba(29,146,221,0.4)]"
                          style={{
                            width:
                              videoDuration > 0
                                ? `${(videoProgress / videoDuration) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>

                      {/* Poster thumbnail while video loads */}
                      <AnimatePresence>
                        {!videoLoaded && (
                          <motion.div
                            key="poster"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 z-10"
                          >
                            <img
                              src={POSTER_URL}
                              alt=""
                              className="w-full h-full object-cover blur-sm scale-105"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <video
                        ref={videoRef as React.RefObject<HTMLVideoElement>}
                        src={VIDEO_URL}
                        autoPlay
                        muted={isMuted}
                        controls={false}
                        preload="auto"
                        playsInline
                        onEnded={handleVideoEnded}
                        onCanPlay={handleVideoCanPlay}
                        className="w-full h-full object-cover"
                      />

                      {/* Sound toggle */}
                      <AnimatePresence>
                        {!videoEnded && showSound && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            onClick={() => {
                              const video = videoRef.current;
                              if (!video) return;
                              video.muted = false;
                              video.volume = 0.4;
                              video.play().catch(() => {});
                              setIsMuted(false);
                              setShowSound(false);
                            }}
                            className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-colors shadow-lg"
                          >
                            <VolumeX size={20} />
                          </motion.button>
                        )}
                      </AnimatePresence>

                      {/* Ended overlay */}
                      <AnimatePresence>
                        {videoEnded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6"
                          >
                            <p className="text-sm text-white/80 text-center leading-relaxed">
                              Prêt à faire le point sur votre situation patrimoniale ?
                            </p>
                            <button
                              onClick={handleContinue}
                              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#1D92DD] to-[#1186D2] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg"
                            >
                              Échanger sur vos objectifs
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* CTA - hidden when video ended to avoid overlap with overlay */}
                {!videoEnded && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                  >
                    <button
                      onClick={handleContinue}
                      disabled={transitioning}
                      className="shrink-0 mt-4 px-10 py-3 rounded-full bg-slate-800 text-white font-semibold text-sm tracking-wide hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2.5 disabled:opacity-50"
                    >
                      <Calendar size={16} />
                      Échanger sur vos objectifs
                    </button>
                  </motion.div>
                )}

                {/* Transitioning overlay — calendly loading */}
                <AnimatePresence>
                  {transitioning && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-xl"
                    >
                      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">Chargement du calendrier...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Calendly inline embed */}
            {step === "calendly" && (
              <motion.div
                key="calendly"
                {...slideLeft}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col h-full min-h-0"
              >
                <div className="flex-1 relative min-h-0 rounded-xl overflow-hidden">
                  {/* Loader while iframe loads */}
                  {!calendlyBookingDone && !iframeReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">Chargement du calendrier...</p>
                    </div>
                  )}

                  {/* Scheduled overlay */}
                  {calendlyBookingDone && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-slate-600">Rendez-vous confirmé !</p>
                      </div>
                    </div>
                  )}

                  {/* Calendly iframe */}
                  {!calendlyBookingDone && (
                    <iframe
                      ref={calendlyRef}
                      src={tenantConfig.calendlyUrl}
                      className="w-full h-full"
                      style={{ minHeight: "500px" }}
                      frameBorder="0"
                      scrolling="no"
                      onLoad={handleIframeLoad}
                      allow="camera *; microphone *; autoplay *; clipboard-write *"
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* Qualification form */}
            {step === "qualification" && (
              <motion.div
                key="qualification"
                {...slideLeft}
                transition={{ duration: 0.4 }}
                className="flex-1 flex h-full min-h-0"
              >
                <QualificationForm />
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </motion.div>
  );
}
