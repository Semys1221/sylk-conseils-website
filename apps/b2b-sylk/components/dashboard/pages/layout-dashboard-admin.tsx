"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAdminStore, type AdminView } from "@workspace/tenant-ui";
import tenantConfig from "@/tenant.config";
import { LayoutDashboard, Globe, TrendingUp, Calendar, Settings, LogOut } from "lucide-react";

const SYLK_LOGO =
  "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png";

const NAV: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "accueil", label: "Accueil", icon: LayoutDashboard },
  { id: "website", label: "Site", icon: Globe },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "rendez-vous", label: "RDV", icon: Calendar },
  { id: "parametres", label: "Réglages", icon: Settings },
];

export function LayoutDashboardAdmin({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  const supabase = createClient();
  const { activeView, setActiveView } = useAdminStore();

  useEffect(() => {
    (async () => {
      const res = (await supabase.auth.getSession()) as {
        data: { session: import("@supabase/supabase-js").AuthSession | null } | null;
      };
      const session = res.data?.session ?? null;
      if (session?.user) {
        const email = session.user.email ?? "";
        setAuthenticated(true);
        setUser({ email });
      } else {
        setAuthenticated(false);
        router.replace("/login");
      }
    })();
  }, []);

  if (authenticated === null) {
    return (
      <div className="dark bg-slate-950 text-slate-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  return (
    <div className="dark bg-slate-950 text-slate-50 min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60">
        <h1 className="heading-4 font-bold text-xl tracking-tight text-white m-0">
          Tableau de bord
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView("parametres")}
            className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-white flex items-center p-1 transition-colors"
          >
            <Settings size={20} />
          </button>
          <Avatar className="w-8 h-8 rounded-full ring-2 ring-slate-800/60">
            <AvatarImage src={SYLK_LOGO} alt={tenantConfig.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-900 to-cyan-800 text-white text-[10px] font-bold">
              {user.email.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-black/80 backdrop-blur-md border-t border-slate-900/80 px-4 pb-safe">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className="relative flex flex-col items-center gap-1 px-3 py-1 bg-transparent border-none cursor-pointer transition-all duration-200"
            >
              {isActive && (
                <span className="absolute inset-x-0 -top-1 mx-auto w-10 h-8 rounded-lg bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.3)] pointer-events-none" />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? "text-blue-400 font-semibold" : "text-slate-500"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
