"use client";

import { useState } from "react";
import { Globe, Users, Calendar, Filter, Search, TrendingUp, Plus } from "lucide-react";

type FilterId = "site" | "leads" | "rdv";

interface ActivityItem {
  id: string;
  icon: typeof Globe;
  title: string;
  subtitle: string;
  value: string;
  valuePositive: boolean;
  time: string;
}

const ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    icon: Globe,
    title: "Visite site web",
    subtitle: "Nouveau visiteur organique",
    value: "+ 850 €",
    valuePositive: true,
    time: "14:30",
  },
  {
    id: "2",
    icon: Users,
    title: "Nouveau lead",
    subtitle: "Thomas Renard — formulaire",
    value: "+ 2 400 €",
    valuePositive: true,
    time: "11:15",
  },
  {
    id: "3",
    icon: Calendar,
    title: "Rendez-vous confirmé",
    subtitle: "Sophie Martin — bilan patrimonial",
    value: "15:00",
    valuePositive: false,
    time: "09:00",
  },
];

const FILTERS: { id: FilterId; label: string; icon: typeof Globe }[] = [
  { id: "site", label: "Site Web", icon: Globe },
  { id: "leads", label: "Leads", icon: Users },
  { id: "rdv", label: "Rendez-vous", icon: Calendar },
];

export default function Accueil() {
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set(["leads"]));

  const toggleFilter = (id: FilterId) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950">
      {/* Hero Card */}
      <div className="px-6 mb-6">
        <div className="aspect-[1.8/1] w-full rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 shadow-[0_8px_40px_rgba(8,47,73,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] p-6 flex flex-col justify-between relative overflow-hidden border border-slate-900">
          {/* Decorative glows */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 left-8 w-24 h-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />

          {/* Top row */}
          <div className="flex justify-between items-start">
            <span className="text-white/90 font-semibold text-sm tracking-tight">
              Sylk Conseils
            </span>
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
              <TrendingUp size={13} className="text-white/80" />
            </div>
          </div>

          {/* Center */}
          <div className="flex flex-col gap-0.5">
            <span className="text-blue-300/80 text-[10px] font-semibold tracking-wider uppercase">
              Pipeline actif
            </span>
            <span className="text-white text-4xl font-bold tracking-tight leading-none">
              28 450 €
            </span>
          </div>

          {/* Bottom */}
          <div className="flex justify-end items-center">
            <span className="text-blue-300/40 text-[9px] font-mono tracking-widest uppercase">
              Montis Data
            </span>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-row gap-2.5 px-6 mb-6 overflow-x-auto scrollbar-none">
        {FILTERS.map(({ id, label, icon: Icon }) => {
          const isActive = activeFilters.has(id);
          return (
            <button
              key={id}
              onClick={() => toggleFilter(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-400/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]"
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Activity List */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-t-3xl p-6 border-t border-slate-800/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <span className="text-slate-100 font-semibold text-base tracking-tight">
            Aujourd&apos;hui
          </span>
          <div className="flex gap-4">
            <button className="p-1 bg-transparent border-none cursor-pointer text-slate-500 hover:text-slate-300 transition-colors">
              <Filter size={16} />
            </button>
            <button className="p-1 bg-transparent border-none cursor-pointer text-slate-500 hover:text-slate-300 transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* List items */}
        <div className="flex flex-col gap-1">
          {ACTIVITY.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between py-3 cursor-pointer ${
                  idx < ACTIVITY.length - 1 ? "border-b border-slate-800/50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-blue-400" />
                </div>
                <div className="flex-1 ml-4 flex flex-col gap-0.5">
                  <span className="text-slate-100 font-medium text-sm leading-tight">
                    {item.title}
                  </span>
                  <span className="text-slate-400 text-xs leading-tight">{item.subtitle}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`text-xs font-semibold tracking-tight ${
                      item.valuePositive ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {item.value}
                  </span>
                  <span className="text-slate-500 text-[10px]">{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <button className="mt-5 w-full flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-500/5 border border-dashed border-blue-500/20 text-blue-400 text-xs font-semibold cursor-pointer hover:bg-blue-500/10 transition-colors">
          <Plus size={14} />
          Ajouter une entrée
        </button>
      </div>
    </div>
  );
}
