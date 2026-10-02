"use client";

import { useEffect, useRef, useState } from "react";
import { useFlowStore } from "./store";
import { AlertCircle, Mic, Camera, MonitorSmartphone } from "lucide-react";

interface ConfigStepProps {
  onContinue: () => void;
  stream?: MediaStream | null;
}

export function ConfigStep({ onContinue, stream }: ConfigStepProps) {
  const setDevices = useFlowStore((s) => s.setDevices);
  const selectedMic = useFlowStore((s) => s.selectedMic);
  const selectedCamera = useFlowStore((s) => s.selectedCamera);
  const selectMic = useFlowStore((s) => s.selectMic);
  const selectCamera = useFlowStore((s) => s.selectCamera);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [cams, setCams] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const hasDevices = mics.length > 0 || cams.length > 0;
  const streamReady = !loading && !error && stream !== null && stream !== undefined;
  const emptyEnumeration = initialized && streamReady && !hasDevices;
  const activationNeeded = !stream && !streamRef.current && !hasDevices && !loading && !error;
  const nothingFound = !loading && !error && !stream && hasDevices === false && streamRef.current !== null;

  const startDevices = async (mediaStream?: MediaStream) => {
    setError(null);
    setLoading(true);
    setInitialized(true);
    try {
      const s = mediaStream || (await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;

      let all: MediaDeviceInfo[];
      try {
        all = await navigator.mediaDevices.enumerateDevices();
      } catch {
        all = [];
      }
      setDevices(all);
      const micList = all.filter((d) => d.kind === "audioinput");
      const camList = all.filter((d) => d.kind === "videoinput");
      setMics(micList);
      setCams(camList);
      if (!selectedMic && micList.length) selectMic(micList[0].deviceId);
      if (!selectedCamera && camList.length) selectCamera(camList[0].deviceId);
    } catch (err: any) {
      const name = err?.name;
      if (name === "NotAllowedError") {
        setError("Autorisation refusée. Veuillez autoriser l'accès à la caméra et au micro dans les paramètres de votre navigateur.");
      } else if (name === "NotFoundError") {
        setError("Aucun micro ou caméra détecté.");
      } else if (name === "NotReadableError") {
        setError("Périphérique déjà utilisé par une autre application.");
      } else {
        setError("Impossible d'accéder à la caméra et au micro.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stream) {
      startDevices(stream);
    }
    return () => {
      streamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 sm:gap-6 px-1 sm:px-2">
      <h2 className="text-lg sm:text-xl md:text-3xl font-light tracking-tight text-slate-700 dark:text-white/90 max-w-lg break-words hyphens-auto">
        Avant de rejoindre votre conseiller nous allons vérifier que votre micro et caméra
        fonctionne.
      </h2>

      {activationNeeded && (
        <button
          onClick={() => startDevices()}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25"
        >
          Activer mon micro et ma caméra
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
          <p className="text-xs text-slate-400 dark:text-white/50">
            Accès aux périphériques…
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="space-y-2 w-full max-w-sm">
          <div className="flex items-start gap-2 text-left bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200">{error}</p>
          </div>
          <button
            onClick={() => startDevices()}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {nothingFound && (
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <div className="flex items-center gap-2 text-left bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3">
            <MonitorSmartphone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-white/50">
              Aucun périphérique trouvé. Vérifiez que vos appareils sont connectés et que les permissions sont accordées.
            </p>
          </div>
          <button
            onClick={() => startDevices()}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Rechercher à nouveau
          </button>
        </div>
      )}

      {(hasDevices || emptyEnumeration) && (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 w-full">
            <div className="w-full sm:w-1/2 aspect-video relative overflow-hidden rounded-xl bg-slate-200 dark:bg-black/30 border border-slate-300 dark:border-white/10">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover mirror"
              />
            </div>

            <div className="w-full sm:w-1/2 flex flex-col items-center justify-center gap-3">
              {mics.length > 0 && (
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 tracking-wider mb-1.5">
                    SÉLECTIONNER LE MICROPHONE
                  </label>
                  <div className="flex items-center gap-2">
                    <Mic className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <select
                      value={selectedMic || ""}
                      onChange={(e) => selectMic(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-white/80 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 appearance-none cursor-pointer"
                    >
                      {mics.map((d) => (
                        <option
                          key={d.deviceId}
                          value={d.deviceId}
                          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white"
                        >
                          {d.label || `Microphone ${d.deviceId.slice(0, 6)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {cams.length > 0 && (
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 dark:text-white/40 tracking-wider mb-1.5">
                    SÉLECTIONNER LA CAMÉRA
                  </label>
                  <div className="flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <select
                      value={selectedCamera || ""}
                      onChange={(e) => selectCamera(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-white/80 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 appearance-none cursor-pointer"
                    >
                      {cams.map((d) => (
                        <option
                          key={d.deviceId}
                          value={d.deviceId}
                          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white"
                        >
                          {d.label || `Caméra ${d.deviceId.slice(0, 6)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {mics.length === 0 && cams.length === 0 && (
                <div className="flex items-center gap-2 text-left bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2">
                  <MonitorSmartphone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <p className="text-xs text-slate-500 dark:text-white/50">
                    {emptyEnumeration
                      ? "Périphériques actifs mais noms indisponibles sur cet appareil"
                      : "Aucun périphérique détecté"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onContinue}
            className="mt-2 px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/25"
          >
            Continuer
          </button>
        </>
      )}
    </div>
  );
}
