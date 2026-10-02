"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { DailyCall } from "@daily-co/daily-js";
import { CalModal } from "./cal-modal";
import tenantConfig from "@/tenant.config";

const DAILY_ROOM_URL = tenantConfig.dailyRoomUrl;

const darkTheme = {
  colors: {
    accent: "#3b82f6",
    accentText: "#ffffff",
    background: "#1e293b",
    backgroundAccent: "#0f172a",
    baseText: "#f1f5f9",
    border: "#334155",
    mainAreaBg: "#1e293b",
    mainAreaBgAccent: "#0f172a",
    mainAreaText: "#e2e8f0",
    supportiveText: "#94a3b8",
  },
};

const lightTheme = {
  colors: {
    accent: "#3b82f6",
    accentText: "#ffffff",
    background: "#f8fafc",
    backgroundAccent: "#f1f5f9",
    baseText: "#0f172a",
    border: "#e2e8f0",
    mainAreaBg: "#ffffff",
    mainAreaBgAccent: "#f8fafc",
    mainAreaText: "#0f172a",
    supportiveText: "#64748b",
  },
};

export function MeetingRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<DailyCall | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [mobileFS, setMobileFS] = useState(false);

  useEffect(() => {
    const handler = () => {
      const isFS = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isFS);
      if (!isFS) setMobileFS(false);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const isFS = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

    if (isFS || mobileFS) {
      if (isFS) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
      }
      setMobileFS(false);
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => setMobileFS(true));
      } else if ((el as any).webkitRequestFullscreen) {
        try {
          (el as any).webkitRequestFullscreen();
        } catch {
          setMobileFS(true);
        }
      } else {
        setMobileFS(true);
      }
    }
  }, [mobileFS]);

  useEffect(() => {
    if (!containerRef.current || frameRef.current) return;
    let destroyed = false;
    let frame: DailyCall;

    import("@daily-co/daily-js").then(({ default: DailyIframe }) => {
      if (destroyed || !containerRef.current) return;
      try {
        frame = DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: true,
          iframeStyle: { width: "100%", height: "100%", border: "none", borderRadius: "16px" },
        });
        frameRef.current = frame;

        const isDark = document.documentElement.classList.contains("dark");
        frame.setTheme(isDark ? darkTheme : lightTheme).catch(() => {});

        frame.setDailyLang("fr");
        frame.join({ url: DAILY_ROOM_URL });

        const iframeEl = frame.iframe();
        if (iframeEl) {
          iframeEl.setAttribute("allow", "camera *; microphone *; autoplay *");
        }

        frame.on("left-meeting", () => {
          if (frameRef.current) {
            frameRef.current.destroy();
            frameRef.current = null;
          }
          setCallEnded(true);
        });
      } catch {
        console.warn("Daily.co non disponible");
      }
    });

    return () => {
      destroyed = true;
      if (frame) {
        frame.destroy();
        frameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-center items-center gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
        <CalModal />
        {!callEnded && (
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-300/60 dark:hover:bg-white/20 transition-all text-xs font-medium shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            Plein écran
          </button>
        )}
      </div>

      {callEnded ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-4xl font-light text-slate-700 dark:text-white/90">
              Bonne journée !!!
            </p>
            <p className="mt-8 text-xs text-slate-400 dark:text-white/40">
              Vous pouvez fermer cette page.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 rounded-xl overflow-hidden bg-slate-200 dark:bg-black/30 min-h-0">
          <div
            ref={containerRef}
            className={`w-full h-full ${mobileFS ? "fixed inset-0 z-50 bg-slate-900" : ""}`}
          />
        </div>
      )}
    </div>
  );
}
