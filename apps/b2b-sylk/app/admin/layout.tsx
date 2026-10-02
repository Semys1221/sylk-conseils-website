"use client";

import { useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore, type AdminView, type SelectedUser } from "@workspace/tenant-ui";
import { useAdminDataStore } from "@/lib/admin-data-store";
import tenantConfig from "@/tenant.config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";
import { LayoutDashboard, TrendingUp, Calendar, Globe, Settings, RefreshCw } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const PAGE_TITLE: Record<AdminView, string> = {
  accueil: "Tableau de bord",
  website: "Site",
  pipeline: "Pipeline",
  "rendez-vous": "Rendez-vous",
  parametres: "Réglages",
};

const NAV: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "accueil", label: "Accueil", icon: LayoutDashboard },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "rendez-vous", label: "RDV", icon: Calendar },
  { id: "website", label: "Site", icon: Globe },
];

const USERS: { id: SelectedUser; name: string; role: string; initials: string; gradient: string }[] = [
  { id: "stephane", name: "Stéphane", role: "Conseiller en gestion de patrimoine", initials: "ST", gradient: "from-cyan-500 to-blue-600" },
  { id: "yvan", name: "Yvan", role: "Responsable commercial", initials: "YV", gradient: "from-violet-500 to-purple-600" },
];

function UserSelection({ onSelect }: { onSelect: (user: SelectedUser) => void }) {
  return (
    <div className="dark flex min-h-dvh items-center justify-center bg-slate-950 px-4">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-600/6 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src={FUNNEL_LOGO_URL}
              alt="SYLK Conseils"
              className="w-16 h-16 rounded-full ring-2 ring-white/10 shadow-lg"
            />
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight font-serif">
                SYLK Conseils
              </h1>
              <p className="text-slate-400 text-sm mt-1">Sélectionnez votre profil</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {USERS.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card
                  size="default"
                  className="cursor-pointer bg-slate-900/60 border-slate-800/60 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] transition-all duration-300 w-full"
                  onClick={() => onSelect(user.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14 rounded-full ring-2 ring-slate-700/60">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${user.gradient} text-white text-lg font-bold`}
                        >
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-lg font-semibold">
                          {user.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm mt-0.5">
                          {user.role}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-slate-600 text-[10px] text-center leading-relaxed max-w-xs">
            Accès réservé au personnel autorisé de SYLK Conseils.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { selectedUser, setSelectedUser, activeView, setActiveView } = useAdminStore();
  const pageTitle = PAGE_TITLE[activeView];
  const { fetchAll, loading, lastFetched } = useAdminDataStore();

  useEffect(() => {
    if (selectedUser) {
      fetchAll();
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return <UserSelection onSelect={setSelectedUser} />;
  }

  const currentUser = USERS.find((u) => u.id === selectedUser)!;

  return (
    <div
      className={`dark bg-slate-950 text-slate-50 min-h-dvh flex flex-col overflow-hidden ${playfair.variable}`}
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <TooltipProvider delay={0}>
          <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-sm">
                      S
                    </div>
                    <span className="text-base font-semibold">SYLK Conseils</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAV.map(({ id, label, icon: Icon }) => (
                      <SidebarMenuItem key={id}>
                        <SidebarMenuButton
                          isActive={activeView === id}
                          onClick={() => setActiveView(id)}
                          tooltip={label}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === "parametres"}
                    onClick={() => setActiveView("parametres")}
                    tooltip="Réglages"
                  >
                    <Settings className="size-4 shrink-0" />
                    <span>Réglages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60"
            >
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hidden md:inline-flex -ml-1 text-slate-400 hover:text-white" />
                <h1 className="heading-4 font-bold text-xl tracking-tight text-white m-0 font-serif active:scale-95 transition-transform duration-100 ease-out">
                  {pageTitle}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchAll()}
                  disabled={loading}
                  className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-white flex items-center gap-1.5 p-1 transition-all duration-200 active:scale-90 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    lastFetched
                      ? `Mis à jour à ${new Date(lastFetched).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                      : "Charger les données"
                  }
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">
                    {loading ? "..." : lastFetched ? "À jour" : "Charger"}
                  </span>
                </button>
                <button
                  onClick={() => setActiveView("parametres")}
                  className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-white flex items-center p-1 transition-all duration-200 active:scale-90"
                >
                  <Settings size={20} />
                </button>
                <Avatar className="w-8 h-8 rounded-full ring-2 ring-slate-800/60 active:scale-90 transition-transform duration-100 ease-out">
                  <AvatarFallback className="bg-gradient-to-br from-blue-900 to-cyan-800 text-white text-[10px] font-bold">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.header>

            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-0 scroll-smooth">
              {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-black/80 backdrop-blur-md border-t border-slate-900/80 px-4 md:hidden">
              {NAV.map(({ id, label, icon: Icon }) => {
                const isActive = activeView === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveView(id)}
                    className="relative flex flex-col items-center gap-1 px-3 py-1 bg-transparent border-none cursor-pointer transition-all duration-200 active:scale-90"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-x-0 -top-1 mx-auto w-10 h-8 rounded-lg bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.3)] pointer-events-none"
                        transition={{ type: "spring", stiffness: 550, damping: 35 }}
                      />
                    )}
                    <Icon
                      size={20}
                      className={`relative z-10 transition-colors duration-200 ${
                        isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    />
                    <span
                      className={`text-[10px] tracking-wide transition-colors duration-200 ${
                        isActive ? "text-blue-400 font-semibold" : "text-slate-500 font-medium"
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
          </SidebarInset>
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
}
