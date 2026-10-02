"use client";

import { useState, createContext, useContext } from "react";
import { FunnelDiagnostic } from "./FunnelDiagnostic";
import { AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useTenant } from "../../tenant-config";

interface FunnelContextValue {
  startFunnel: () => void;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function useFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used within FunnelApp");
  return ctx;
}

export function FunnelApp({ children }: { children: React.ReactNode }) {
  const tenant = useTenant();
  const [currentView, setCurrentView] = useState<"home" | "funnel">("home");

  const startFunnel = () => setCurrentView("funnel");

  return (
    <FunnelContext.Provider value={{ startFunnel }}>
      <div className="funnel-page w-full font-sans text-sm relative overflow-x-hidden flex flex-col min-h-screen bg-[#F9F9F9]">
        <header className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-10 lg:px-12 flex items-center justify-between pointer-events-none">
          <div
            className="flex items-center pointer-events-auto mt-2 gap-2 origin-left cursor-pointer"
            onClick={() => setCurrentView("home")}
          >
            <img
              src={tenant.logo}
              alt={`${tenant.name} Logo`}
              className="h-9 w-9 object-contain rounded-full shadow-sm"
            />
            <span className="text-lg md:text-xl font-serif text-[#111111] tracking-wide">
              {tenant.name}
            </span>
          </div>
          <div className="pointer-events-auto mt-2 flex items-center md:mr-6 lg:mr-12">
            {currentView === "home" ? null : (
              <button
                onClick={() => setCurrentView("home")}
                className="flex items-center gap-2 text-[#666666] hover:text-[#111111] transition-colors group px-4 py-2 border border-[#D4D4D4] rounded-full hover:bg-[#F9F9F9]"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium tracking-wide text-xs uppercase">Retour</span>
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === "home" && <div key="home">{children}</div>}
          {currentView === "funnel" && (
            <FunnelDiagnostic key="funnel" onBack={() => setCurrentView("home")} />
          )}
        </AnimatePresence>
      </div>
    </FunnelContext.Provider>
  );
}
