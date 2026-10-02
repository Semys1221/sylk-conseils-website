"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, KeyRound } from "lucide-react";
import DiscoveryForm from "./DiscoveryForm";
import StrategyForm from "./StrategyForm";
import ClosingForm from "./ClosingForm";
import WelcomeScreen from "./WelcomeScreen";
import { VideoCall } from "@workspace/tenant-ui";
import type { CallConfig, CallConfigCategory } from "@workspace/tenant-ui";

type Phase = "r1" | "r2" | "r3";

export default function SalleDeVenteApp() {
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dailyToken, setDailyToken] = useState("");
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [phase, setPhase] = useState<Phase>("r1");
  const [callConfig, setCallConfig] = useState<CallConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [showCodePrompt, setShowCodePrompt] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID ?? "sylk-conseils";
  const channelId = process.env.NEXT_PUBLIC_PUSHER_CHANNEL_ID ?? "sylk-conseils";
  const ADMIN_PIN = "2901";

  const dailyRoomName = "sylk-decouverte";
  const dailyUrl = `https://sylk-conseils.daily.co/${dailyRoomName}${dailyToken ? `?t=${dailyToken}` : ""}`;

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/call-config?tenant_id=${tenantId}`);
        if (res.ok) {
          const data = await res.json();
          setCallConfig(data.config);
        }
      } catch {
        /* ignore */
      } finally {
        setConfigLoading(false);
      }
    }
    void loadConfig();
  }, [tenantId]);

  const handleJoin = (data: { name: string; email: string; token: string; isAdvisor: boolean }) => {
    setUserName(data.name);
    setUserEmail(data.email);
    setDailyToken(data.token);
    setIsAdvisor(data.isAdvisor);
    setJoined(true);
  };

  const handleCodeSubmit = () => {
    if (codeInput === ADMIN_PIN) {
      setCodeError(false);
      setShowCodePrompt(false);
      setCodeInput("");
      setIsAdvisor(true);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 800);
    }
  };

  const phaseLabels: Record<string, string> = {
    r1: callConfig?.r1?.label ?? "Découverte",
    r2: callConfig?.r2?.label ?? "Stratégie",
    r3: callConfig?.r3?.label ?? "Closing",
  };
  const discoveryFields = callConfig?.r1?.categories as CallConfigCategory[] | undefined;
  const strategySteps = callConfig?.r2?.steps;
  const closingSteps = callConfig?.r3?.steps;

  if (!joined) return <WelcomeScreen onJoin={handleJoin} />;

  if (configLoading) {
    return (
      <div className="h-dvh w-full bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full bg-background flex flex-col overflow-hidden">
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* Left panel — forms */}
        <div className="w-full lg:w-1/2 flex flex-col bg-muted/30 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border min-h-0">
          {/* Phase header */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-serif text-foreground text-sm font-medium">
                {phaseLabels[phase]}
              </span>
              {isAdvisor ? (
                <span className="text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-medium">
                  Mode CGP
                </span>
              ) : (
                <button
                  onClick={() => setShowCodePrompt(true)}
                  className="text-[10px] text-muted-foreground hover:text-foreground bg-muted border border-border px-2 py-0.5 rounded-full transition-all flex items-center gap-1"
                >
                  <KeyRound className="h-2.5 w-2.5" /> Code
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              {(["r1", "r2", "r3"] as Phase[]).map((p, i) => (
                <span key={p} className="flex items-center gap-1">
                  {i > 0 && <ArrowRight size={8} className="text-muted-foreground/40" />}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      phase === p
                        ? p === "r1"
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : p === "r2"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        : "text-muted-foreground border-transparent"
                    }`}
                  >
                    {i + 1}. {phaseLabels[p]}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Form body */}
          <div className="flex-1 relative min-h-0">
            <AnimatePresence mode="wait">
              {phase === "r1" && (
                <motion.div
                  key="r1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <DiscoveryForm
                    channelId={channelId}
                    isCgpMode={isAdvisor}
                    onAdvance={() => setPhase("r2")}
                    fields={discoveryFields}
                  />
                </motion.div>
              )}
              {phase === "r2" && (
                <motion.div
                  key="r2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <StrategyForm
                    channelId={channelId}
                    isAdvisor={isAdvisor}
                    onAdvance={() => setPhase("r3")}
                    steps={strategySteps}
                  />
                </motion.div>
              )}
              {phase === "r3" && (
                <motion.div
                  key="r3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <ClosingForm
                    channelId={channelId}
                    isAdvisor={isAdvisor}
                    onAdvance={() => {}}
                    sessionId={`session-${Date.now()}`}
                    steps={closingSteps}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel — video */}
        <div className="w-full lg:w-1/2 relative shrink-0 h-[35vh] lg:h-full bg-gray-900">
          <VideoCall url={dailyUrl} inline />
        </div>
      </div>

      {/* Code modal */}
      <AnimatePresence>
        {showCodePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCodePrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-border"
            >
              <div className="text-center mb-4">
                <KeyRound className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-foreground">Code d&apos;accès CGP</h3>
                <p className="text-xs text-muted-foreground mt-1">Réservé au conseiller</p>
              </div>
              <input
                type="password"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                autoFocus
                placeholder="Code secret"
                className={`w-full bg-muted border rounded-xl px-4 py-3 text-sm text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  codeError ? "border-red-300 bg-red-50 animate-shake" : "border-border"
                }`}
              />
              {codeError && <p className="text-xs text-red-500 text-center mt-1">Code incorrect</p>}
              <button
                onClick={handleCodeSubmit}
                disabled={!codeInput.trim()}
                className="w-full mt-4 bg-primary text-primary-foreground font-semibold rounded-xl py-2.5 text-sm hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Valider
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
