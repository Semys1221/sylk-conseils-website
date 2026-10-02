"use client";

import { Calendar, Clock, Globe, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MuxVideo from "@mux/mux-video-react";
import { useFunnel, MeshBackground } from "@workspace/tenant-ui";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";
import tenantConfig from "@/tenant.config";

export function FunnelHome({ onStart }: { onStart?: () => void }) {
  const ctx = useFunnel();
  const startFunnel = onStart || ctx.startFunnel;
  const [isMuted, setIsMuted] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration > 0 && video.currentTime >= video.duration - 1) {
        video.pause();
        setVideoEnded(true);
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, []);

  return (
    <motion.div
      className="mesh-container flex flex-col md:flex-row w-full min-h-screen items-center justify-center gap-4 md:gap-6 lg:gap-8 p-4 md:p-8 lg:p-12"
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <MeshBackground />

      {/* Left Side - Video Card */}
      <div className="w-full md:w-1/2 lg:w-[48%] max-w-xl">
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black aspect-[9/16] md:aspect-auto md:h-[80vh]">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Video */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MuxVideo
              ref={videoRef}
              playbackId="Vw7jCSfTaId1VyRqVsg1xMEA1Tg0102Vseqb158q100pTE"
              autoPlay="muted"
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-[center_30%]"
            />
          </div>

          <AnimatePresence>
            {videoEnded && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-40 bg-black/60 flex flex-col items-center justify-center p-6 pointer-events-auto"
              >
                <motion.button
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                  onClick={() => window.location.href = tenantConfig.calendlyUrl}
                  className="flex items-center gap-4 bg-white text-deep-800 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl group"
                >
                  <img
                    src={FUNNEL_LOGO_URL}
                    alt="SYLK Conseils"
                    className="w-8 h-8 object-contain rounded-full shadow-md"
                  />
                  <span>Prendre rendez-vous</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sound Toggle */}
          <AnimatePresence>
            {!videoEnded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 right-4 z-30 pointer-events-auto"
              >
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 flex items-center justify-center hover:bg-black/60 transition-all duration-300 text-white shadow-lg"
                >
                  {isMuted ? (
                    <VolumeX size={16} className="text-white/70" />
                  ) : (
                    <Volume2 size={16} className="text-white/70" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - Content Card */}
      <div className="w-full md:w-1/2 lg:w-[48%] max-w-xl">
        <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 w-full flex flex-col items-center md:items-start text-center md:text-left">
          {/* LinkedIn Proof Badge */}
          <a
            href="https://www.linkedin.com/in/stephane-lawnicki"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-deep-200/40 text-deep-500 rounded-full pl-1.5 pr-4 py-1.5 text-[10px] sm:text-xs font-semibold tracking-widest uppercase shadow-lg hover:bg-white/80 transition-colors mb-8 sm:mb-12"
          >
            <div className="bg-[#0077b5] rounded-full p-1.5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.475-.9 1.637-1.85 3.37-1.85 3.605 0 4.268 2.372 4.268 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            +3 000 Connexions
          </a>

          {/* Main Headline */}
          <h1 className="text-[2.25rem] leading-[1.15] sm:text-5xl lg:text-[4rem] lg:leading-[1.05] font-light text-deep-800 tracking-tight text-balance mb-8">
            La quintessence de votre{" "}
            <span className="font-serif italic text-deep-500">patrimoine</span> commence ici.
          </h1>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-12">
            <div className="inline-flex items-center gap-2 text-deep-700/60">
              <Clock size={16} className="text-deep-400" />
              <span className="font-medium text-sm tracking-wide">Diagnostic 15 min</span>
            </div>
            <div className="w-1 h-1 bg-deep-200 rounded-full"></div>
            <a
              href="https://sylkconseils.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-deep-700/60 hover:text-deep-800 transition-colors"
            >
              <Globe size={16} className="text-deep-400" />
              <span className="font-medium text-sm tracking-wide">sylkconseils.com</span>
            </a>
          </div>

          {/* Call to Action */}
          <button
            onClick={() => window.location.href = tenantConfig.calendlyUrl}
            className="w-full sm:w-auto bg-deep-800 text-white px-10 py-[1.125rem] rounded-full flex items-center justify-center gap-3 font-semibold hover:bg-deep-700 transition-all duration-300 active:scale-95 shadow-lg group"
          >
            <Calendar
              size={18}
              className="text-white/80 group-hover:-translate-y-0.5 transition-transform"
            />
            <span>Planifier un échange</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
