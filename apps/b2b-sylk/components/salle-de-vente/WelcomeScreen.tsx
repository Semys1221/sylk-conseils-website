"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Mic, Volume2, Check, X, Loader2, ArrowRight, KeyRound, Star } from "lucide-react";

interface WelcomeScreenProps {
  onJoin: (data: { name: string; email: string; token: string; isAdvisor: boolean }) => void;
}

export default function WelcomeScreen({ onJoin }: WelcomeScreenProps) {
  const [step, setStep] = useState<"form" | "code">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cameraOk, setCameraOk] = useState<boolean | null>(null);
  const [micOk, setMicOk] = useState<boolean | null>(null);
  const [speakerOk, setSpeakerOk] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [joining, setJoining] = useState(false);
  const [checkingDevices, setCheckingDevices] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const ADMIN_PIN = "2901";

  const [deviceError, setDeviceError] = useState<string | null>(null);

  const checkDevices = useCallback(async () => {
    setCheckingDevices(true);
    setDeviceError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOk(true);
      setMicOk(true);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.frequency.value = 440;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
        setSpeakerOk(true);
      }, 400);
    } catch (err: any) {
      setCameraOk(false);
      setMicOk(false);
      setSpeakerOk(false);
      const name = err?.name;
      if (name === "NotAllowedError") {
        setDeviceError("Autorisation refusée. Vérifiez les paramètres de votre navigateur.");
      } else if (name === "NotFoundError") {
        setDeviceError("Aucun micro ou caméra détecté.");
      } else {
        setDeviceError("Impossible d'accéder à la caméra et au micro.");
      }
    } finally {
      setCheckingDevices(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const allDevicesOk = cameraOk && micOk && speakerOk;

  const handleJoin = () => {
    if (!name.trim() || !email.trim()) return;
    checkDevices();
    setStep("code");
  };

  const handleCodeSubmit = async () => {
    if (code === ADMIN_PIN) {
      setCodeError(false);
      await doJoin(true);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 800);
    }
  };

  const doJoin = async (isAdvisor: boolean) => {
    setJoining(true);
    try {
      const res = await fetch("/api/room/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName: "sylk-decouverte", isOwner: isAdvisor, userName: name }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.token) onJoin({ name, email, token: json.token, isAdvisor });
      }
    } catch {
      /* ignore */
    } finally {
      setJoining(false);
    }
  };

  const DeviceBadge = ({
    ok,
    label,
    icon,
  }: {
    ok: boolean | null;
    label: string;
    icon: React.ReactNode;
  }) => (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] border transition-all ${
        ok === true
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : ok === false
            ? "border-red-200 bg-red-50 text-red-600"
            : "border-border bg-muted text-muted-foreground"
      }`}
    >
      {checkingDevices ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : ok ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      <span className="hidden xs:inline">{icon}</span>
      <span className="hidden xs:inline">{label}</span>
    </div>
  );

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-3 sm:p-6 bg-gradient-to-br from-teal-900 via-cyan-800 to-teal-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-teal-950/20">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium mb-2">
              Votre salle de conseil privée
            </h1>
            <p className="text-sm text-white/60 max-w-xs mx-auto leading-relaxed px-2">
              Rejoignez votre conseiller en gestion de patrimoine dans un espace sécurisé.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Stéphane Lawnicki"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">
                    Votre email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="direction@sylkconseils.com"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                  <DeviceBadge ok={cameraOk} label="Caméra" icon={<Camera className="h-3 w-3" />} />
                  <DeviceBadge ok={micOk} label="Micro" icon={<Mic className="h-3 w-3" />} />
                  <DeviceBadge ok={speakerOk} label="Son" icon={<Volume2 className="h-3 w-3" />} />
                </div>

                {cameraOk && (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover mirror"
                    />
                  </div>
                )}

                {!allDevicesOk && !checkingDevices && (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-200 text-center bg-amber-500/10 rounded-lg py-2 px-3 border border-amber-500/20">
                      {deviceError || "Certains périphériques ne sont pas détectés. Vérifiez vos autorisations."}
                    </p>
                    <button
                      onClick={checkDevices}
                      className="w-full text-xs text-white/60 hover:text-white/80 underline text-center"
                    >
                      Vérifier à nouveau
                    </button>
                  </div>
                )}

                <button
                  onClick={handleJoin}
                  disabled={!name.trim() || !email.trim() || joining || checkingDevices}
                  className="w-full flex items-center justify-center gap-2 bg-white text-teal-800 font-semibold rounded-full py-3.5 text-sm hover:bg-white/95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-950/30"
                >
                  {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Rejoindre la salle
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="text-center mb-2">
                  <KeyRound className="h-8 w-8 mx-auto mb-2 text-white/60" />
                  <p className="text-sm text-white/70">Code d&apos;accès requis</p>
                </div>

                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                  placeholder="Code secret"
                  autoFocus
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/15 text-center text-lg tracking-widest transition-all ${
                    codeError
                      ? "border-red-400/50 bg-red-500/10 animate-shake"
                      : "border-white/15 focus:border-white/30"
                  }`}
                />

                {codeError && <p className="text-xs text-red-200 text-center">Code incorrect</p>}

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep("form")}
                    className="flex-1 bg-white/10 border border-white/15 text-white/80 font-medium rounded-full py-3 text-sm hover:bg-white/15 transition-all"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleCodeSubmit}
                    disabled={!code.trim() || joining}
                    className="flex-1 bg-white text-teal-800 font-semibold rounded-full py-3 text-sm hover:bg-white/95 disabled:opacity-40 transition-all"
                  >
                    {joining ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Valider"}
                  </button>
                </div>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-transparent text-[10px] text-white/40">ou</span>
                  </div>
                </div>

                <button
                  onClick={() => doJoin(false)}
                  disabled={joining}
                  className="w-full bg-white/5 border border-white/10 text-white/60 font-medium rounded-full py-3 text-xs hover:bg-white/10 disabled:opacity-40 transition-all"
                >
                  {joining ? (
                    <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                  ) : (
                    "Rejoindre en tant que client"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-white/30 text-[10px] mt-4">
          SYLK Conseils — Conseil en Gestion de Patrimoine
        </p>
      </motion.div>
    </div>
  );
}
