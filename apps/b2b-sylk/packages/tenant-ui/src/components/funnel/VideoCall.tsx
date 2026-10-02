"use client";

import { useEffect, useRef, useState } from "react";
import type { DailyCall } from "@daily-co/daily-js";
import { Loader2, X, Presentation } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTenant } from "../../tenant-config";

interface VideoCallProps {
  url: string;
  onLeave?: () => void;
  inline?: boolean;
}

export function VideoCall({ url, onLeave, inline = false }: VideoCallProps) {
  const { colors } = useTenant();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<DailyCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [dummyPresentation, setDummyPresentation] = useState<any>(null);

  useEffect(() => {
    let cleanupPusher: (() => void) | undefined;

    import("pusher-js").then(({ default: Pusher }) => {
      const pusher = new Pusher("65303f1a1706efa230db", {
        cluster: "eu",
      });
      const channel = pusher.subscribe("my-channel");

      channel.bind("my-event", (data: any) => {
        console.log("Pusher event received:", data);
        setDummyPresentation(data);
        setTimeout(() => setDummyPresentation(null), 8000);
      });

      cleanupPusher = () => {
        channel.unbind_all();
        pusher.unsubscribe("my-channel");
        pusher.disconnect();
      };
    });

    return () => cleanupPusher?.();
  }, []);

  useEffect(() => {
    if (!containerRef.current || frameRef.current) return;

    let frame: DailyCall;
    let destroyed = false;

    import("@daily-co/daily-js").then(({ default: DailyIframe }) => {
      if (destroyed || !containerRef.current || frameRef.current) return;

      frame = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "16px",
        },
      });

      frameRef.current = frame;

      frame.join({ url });

      frame.on("joined-meeting", () => {
        setLoading(false);
      });

      frame.on("left-meeting", () => {
        onLeave?.();
      });
    });

    return () => {
      destroyed = true;
      if (frameRef.current) {
        frameRef.current.destroy();
        frameRef.current = null;
      }
    };
  }, [url, onLeave]);

  const content = (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: inline ? "24px" : "16px",
        boxShadow: inline ? undefined : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: inline ? undefined : `1px solid ${colors.border}`,
        maxWidth: inline ? undefined : "1152px",
        maxHeight: inline ? undefined : "800px",
      }}
    >
      {inline && (
        <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white/80 border border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </div>
      )}
      {!inline && (
        <button
          onClick={() => {
            frameRef.current?.leave();
            onLeave?.();
          }}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
        >
          <X size={20} />
        </button>
      )}

      {loading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-0"
          style={{ backgroundColor: colors.cardBg }}
        >
          <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: colors.textAccent }} />
          <p className="text-slate-300 font-medium">Connexion en cours...</p>
        </div>
      )}

      <AnimatePresence>
        {dummyPresentation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
            style={{
              backgroundColor: `${colors.cardBg}f2`,
              borderColor: `${colors.textAccent}4d`,
            }}
          >
            <div className="p-2 rounded-full" style={{ backgroundColor: `${colors.textAccent}33` }}>
              <Presentation size={24} style={{ color: colors.textAccent }} />
            </div>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: colors.textAccent }}
              >
                Synchronisation Live
              </p>
              <p className="font-mono text-sm max-w-sm truncate text-slate-200">
                {typeof dummyPresentation === "string"
                  ? dummyPresentation
                  : JSON.stringify(dummyPresentation)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="w-full h-full relative z-0" />
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
    >
      {content}
    </motion.div>
  );
}
