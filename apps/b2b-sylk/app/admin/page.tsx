"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminStore, type AdminView } from "@workspace/tenant-ui";
import { OnboardingOverlay } from "@/components/dashboard/atomes/onboarding-overlay";
import { useAdminDataStore, type ApiActivityItem } from "@/lib/admin-data-store";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";
import { Globe, Users, Calendar, TrendingUp } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/* ── Sub-pages ─────────────────────────────────── */
import Website from "@/components/dashboard/pages/Website";
import Pipeline from "@/components/dashboard/pages/Pipeline";
import RendezVous from "@/components/dashboard/pages/Rendez-vous";
import Parametres from "@/components/dashboard/pages/Paramètres";

/* ── Types ─────────────────────────────────────── */
type FilterId = "tout" | "site" | "leads" | "rdv";

const FILTERS: { id: FilterId; label: string; icon: typeof Globe }[] = [
  { id: "tout", label: "Tout", icon: TrendingUp },
  { id: "site", label: "Site Web", icon: Globe },
  { id: "leads", label: "Leads", icon: Users },
  { id: "rdv", label: "Rendez-vous", icon: Calendar },
];

/* ── Activity helpers ──────────────────────────── */
const TYPE_ICON: Record<ApiActivityItem["type"], typeof Globe> = {
  visit: Globe,
  lead: Users,
  rdv: Calendar,
};

const TYPE_COLORS: Record<
  ApiActivityItem["type"],
  { bg: string; shadow: string; icon: string; glow: string; title: { base: string; new: string } }
> = {
  visit: {
    bg: "from-violet-500 to-purple-500/20",
    shadow: "rgba(139,92,246,0.25)",
    icon: "text-violet-300",
    glow: "bg-violet-500/20",
    title: { base: "text-violet-400", new: "text-violet-300" },
  },
  rdv: {
    bg: "from-orange-500 to-amber-500/20",
    shadow: "rgba(249,115,22,0.25)",
    icon: "text-orange-300",
    glow: "bg-orange-500/20",
    title: { base: "text-orange-400", new: "text-orange-300" },
  },
  lead: {
    bg: "from-blue-500 to-cyan-500/20",
    shadow: "rgba(59,130,246,0.25)",
    icon: "text-blue-300",
    glow: "bg-blue-500/20",
    title: { base: "text-blue-400", new: "text-blue-300" },
  },
};

const TYPE_FILTER: Record<FilterId, ApiActivityItem["type"][]> = {
  tout: ["visit", "lead", "rdv"],
  site: ["visit"],
  leads: ["lead"],
  rdv: ["rdv"],
};

const ENCOURS_KEY = "sylk-encours-actuel";
const SEEN_KEY = "sylk-seen-ids";
const ITEMS_PER_PAGE = 10;

function formatEncours(raw: string): string {
  const num = parseInt(raw.replace(/\s/g, ""), 10);
  if (isNaN(num)) return "4 000 000 €";
  return num.toLocaleString("fr-FR") + " €";
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Paris",
  });
}

/* ── Accueil view (inlined) ────────────────────── */
function Accueil() {
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("leads");
  const [encours, setEncours] = useState("4 000 000 €");
  const [page, setPage] = useState(1);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const activities = useAdminDataStore((s) => s.activity);
  const loading = useAdminDataStore((s) => s.loading);

  useEffect(() => {
    const raw = localStorage.getItem(ENCOURS_KEY);
    if (raw) setEncours(formatEncours(raw));
    const onStorage = () => {
      const val = localStorage.getItem(ENCOURS_KEY);
      if (val) setEncours(formatEncours(val));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seenIds]));
  }, [seenIds]);

  const filtered = activities.filter((a) => TYPE_FILTER[selectedFilter].includes(a.type));
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  const dismissNewItems = useCallback(() => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      for (const item of pageItems) next.add(item.id);
      return next;
    });
  }, [pageItems]);

  return (
    <div className="flex flex-col min-h-full bg-slate-950">
      {/* ── Hero Card ── */}
      <div className="px-6 mb-6">
        <motion.div
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative aspect-[1.8/1] w-full rounded-3xl overflow-hidden bg-gradient-to-b from-cyan-950 via-blue-950 to-slate-950 border border-cyan-900/30 shadow-[0_8px_40px_rgba(8,47,73,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          {/* Wave 1 — deep, slow, large */}
          <div className="absolute bottom-0 left-0 w-full h-[55%] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 240 120" preserveAspectRatio="none">
                <path
                  d="M0,60 Q30,24 60,60 Q90,96 120,60 Q150,24 180,60 Q210,96 240,60 L240,120 L0,120 Z"
                  fill="rgba(6,182,212,0.06)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Wave 2 — medium depth, medium speed */}
          <div className="absolute bottom-0 left-0 w-full h-[40%] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 240 80" preserveAspectRatio="none">
                <path
                  d="M0,40 Q30,12 60,40 Q90,68 120,40 Q150,12 180,40 Q210,68 240,40 L240,80 L0,80 Z"
                  fill="rgba(34,211,238,0.10)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Wave 3 — front, bright, fast */}
          <div className="absolute bottom-0 left-0 w-full h-[25%] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 240 50" preserveAspectRatio="none">
                <path
                  d="M0,25 Q30,6 60,25 Q90,44 120,25 Q150,6 180,25 Q210,44 240,25 L240,50 L0,50 Z"
                  fill="rgba(34,211,238,0.14)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Wave 3 bis — thin stroke line on top for sharpness */}
          <div className="absolute bottom-0 left-0 w-full h-[25%] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ width: "200%" }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 240 50" preserveAspectRatio="none">
                <path
                  d="M0,25 Q30,6 60,25 Q90,44 120,25 Q150,6 180,25 Q210,44 240,25"
                  fill="none"
                  stroke="rgba(34,211,238,0.25)"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>
          </div>

          {/* Atmospheric glows */}
          <div className="absolute -top-8 -right-4 w-48 h-48 rounded-full bg-cyan-400/12 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-8 w-36 h-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-52 h-32 rounded-full bg-cyan-500/6 blur-3xl pointer-events-none" />

          {/* Subtle glass veil */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-slate-950/10 rounded-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 h-full p-6 flex flex-col items-center justify-center">
            <div className="absolute top-4 left-3 flex items-center gap-2">
              <img
                src={FUNNEL_LOGO_URL}
                alt="SYLK"
                className="w-5 h-5 rounded-full ring-1 ring-white/20"
              />
              <span className="text-white/80 font-serif text-xs tracking-wider">SYLK Conseils</span>
            </div>

            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-blue-300/80 text-[10px] font-semibold tracking-wider uppercase">
                Encours actuel
              </span>
              <span className="text-white heading-4 text-2xl font-bold tracking-tight leading-none">
                {encours}
              </span>
            </div>

            <div className="absolute bottom-3 right-6">
              <span className="text-blue-300/25 text-[7px] font-mono tracking-widest uppercase">
                Powered by Montis
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="px-6 mb-6 space-y-2">
        <div className="flex bg-slate-900/50 rounded-full p-1 border border-slate-800/50">
          {FILTERS.filter((f) => f.id !== "tout").map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedFilter(id);
                setPage(1);
                dismissNewItems();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedFilter === id
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-[0_0_12px_rgba(37,99,235,0.25)] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
        <div className="flex bg-slate-900/50 rounded-full p-1 border border-slate-800/50 max-w-[160px] mx-auto">
          {FILTERS.filter((f) => f.id === "tout").map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSelectedFilter(id);
                setPage(1);
                dismissNewItems();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedFilter === id
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-[0_0_12px_rgba(37,99,235,0.25)] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Activity List ── */}
      <div
        className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-t-3xl p-6 border-t border-slate-800/40 flex flex-col min-h-0"
        onClick={dismissNewItems}
      >
        <div className="flex justify-between items-center mb-5 shrink-0">
          <span className="text-slate-100 font-semibold text-base tracking-tight">
            Activité récente
          </span>
          {!loading && (
            <span className="text-xs text-slate-400">
              {filtered.length} événement{filtered.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 px-3 -mx-3">
                <div className="size-10 rounded-full bg-slate-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-800 rounded animate-pulse w-1/3" />
                  <div className="h-2.5 bg-slate-800/60 rounded animate-pulse w-2/3" />
                </div>
                <div className="h-2.5 bg-slate-800/60 rounded animate-pulse w-10" />
              </div>
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <Calendar className="size-5 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">Tout est calme</p>
            <p className="text-xs text-slate-500 max-w-xs">
              Votre activité apparaîtra ici dès qu&apos;il y aura du trafic.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="flex flex-col gap-1">
                {pageItems.map((item, idx) => {
                  const Icon = TYPE_ICON[item.type];
                  const c = TYPE_COLORS[item.type];
                  const isNew = !seenIds.has(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={isNew ? { opacity: 0, x: 30 } : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        isNew
                          ? { type: "spring", stiffness: 300, damping: 22 }
                          : { duration: 0.3, delay: idx * 0.04, ease: "easeOut" }
                      }
                      className={`relative overflow-hidden flex items-center justify-between py-3 px-3 -mx-3 rounded-xl transition-all duration-700 ${
                        isNew
                          ? "bg-gradient-to-r from-blue-950 via-blue-900/40 to-slate-900 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                          : "opacity-40 hover:border-slate-700/50 hover:shadow-sm"
                      }`}
                    >
                      {/* Shimmer overlay for new items */}
                      {isNew && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "200%" }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                      )}

                      {/* Icon with pulsing glow */}
                      <div className="relative shrink-0">
                        {isNew && (
                          <motion.div
                            className={`absolute -inset-1.5 rounded-full ${c.glow} blur-md`}
                            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          />
                        )}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full bg-gradient-to-br ${c.bg} flex items-center justify-center shrink-0`}
                          style={{ boxShadow: `0 0 12px ${c.shadow}` }}
                        >
                          <Icon size={17} className={c.icon} />
                        </div>
                      </div>
                      <div className="flex-1 ml-4 flex flex-col gap-0.5 relative z-10">
                        <span
                          className={`text-sm leading-tight font-medium ${isNew ? c.title.new : c.title.base}`}
                        >
                          {item.title}
                          {isNew && (
                            <span className="ml-2 text-[9px] font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full">
                              Nouveau
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400 text-xs leading-tight">
                          {item.type === "lead"
                            ? item.subtitle.split(" — ")[0].trim()
                            : item.subtitle}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px] shrink-0 ml-2">
                        {formatTime(item.timestamp)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {totalPages > 1 && (
              <nav className="shrink-0 mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, safePage - 1))}
                        text="Précédent"
                      />
                    </PaginationItem>
                    {pageNumbers.map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink isActive={n === safePage} onClick={() => setPage(n)}>
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                        text="Suivant"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Slide direction tracker ───────────────────── */
const VIEW_ORDER: AdminView[] = ["accueil", "pipeline", "rendez-vous", "website", "parametres"];

/* ── View registry ─────────────────────────────── */
const VIEWS: Record<AdminView, React.ComponentType> = {
  accueil: Accueil,
  website: Website,
  pipeline: Pipeline,
  "rendez-vous": RendezVous,
  parametres: Parametres,
};

/* ── Page ──────────────────────────────────────── */
export default function AdminPage() {
  const activeView = useAdminStore((s) => s.activeView);
  const prevView = useRef(activeView);
  const direction = useRef<"forward" | "back">("forward");

  if (VIEW_ORDER.indexOf(activeView) > VIEW_ORDER.indexOf(prevView.current)) {
    direction.current = "forward";
  } else if (VIEW_ORDER.indexOf(activeView) < VIEW_ORDER.indexOf(prevView.current)) {
    direction.current = "back";
  }
  prevView.current = activeView;

  const ViewComponent = VIEWS[activeView];

  return (
    <>
      <OnboardingOverlay />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: direction.current === "forward" ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction.current === "forward" ? -40 : 40 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ViewComponent />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
