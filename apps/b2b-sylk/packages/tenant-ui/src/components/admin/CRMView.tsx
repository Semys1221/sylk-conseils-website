"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ThumbsUp,
  MousePointerClick,
  PhoneCall,
  RefreshCw,
  Loader2,
  Calendar,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { CRMStats, CRMActivity, CRMActivityType } from "@workspace/shared-types";

interface CRMViewProps {
  tenantId: string;
}

const TYPE_CONFIG: Record<
  CRMActivityType,
  { label: string; icon: typeof ThumbsUp; color: string; bgColor: string }
> = {
  interested_prospect: {
    label: "Prospects intéressés",
    icon: ThumbsUp,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  website_visit: {
    label: "Visites site web",
    icon: MousePointerClick,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  booked_call: {
    label: "Rendez-vous bookés",
    icon: PhoneCall,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
};

export function CRMView({ tenantId }: CRMViewProps) {
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [typeFilter, setTypeFilter] = useState<CRMActivityType | "all">("all");
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        fetch(`/api/crm/stats?tenant_id=${tenantId}`),
        fetch(`/api/crm/activities?tenant_id=${tenantId}&limit=50`),
      ]);
      if (statsRes.ok) {
        const { data } = await statsRes.json();
        setStats(data);
      }
      if (activitiesRes.ok) {
        const { data } = await activitiesRes.json();
        setActivities(data ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/crm/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId }),
      });
      await fetchData();
    } catch {
      /* ignore */
    } finally {
      setSyncing(false);
    }
  };

  const filteredActivities =
    typeFilter === "all" ? activities : activities.filter((a) => a.type === typeFilter);

  const ActivityIcon = ({ type }: { type: CRMActivityType }) => {
    const cfg = TYPE_CONFIG[type];
    const Icon = cfg.icon;
    return (
      <div className={`${cfg.bgColor} p-2 rounded-lg`}>
        <Icon size={14} className={cfg.color} />
      </div>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">CRM</p>
          <h1 className="text-2xl font-semibold text-gray-900">Salle de vente</h1>
          <p className="text-sm text-gray-500 mt-1">
            Activité commerciale : prospects intéressés, visites et rendez-vous.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-black disabled:opacity-50 transition-all"
        >
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Synchroniser
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {(["interested_prospect", "website_visit", "booked_call"] as CRMActivityType[]).map(
            (type) => {
              const cfg = TYPE_CONFIG[type];
              const Icon = cfg.icon;
              const value =
                type === "interested_prospect"
                  ? stats.interested_count
                  : type === "website_visit"
                    ? stats.website_visit_count
                    : stats.booked_call_count;
              return (
                <div key={type} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${cfg.bgColor} p-2.5 rounded-xl`}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{cfg.label}</p>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4">
        {(["all", "interested_prospect", "website_visit", "booked_call"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              typeFilter === t
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {t === "all" ? "Tout" : TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white border border-gray-100 rounded-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="text-gray-400 animate-spin" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Aucune activité</p>
            <p className="text-xs text-gray-400">
              Synchronisez les données pour voir l&apos;activité commerciale.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <ActivityIcon type={activity.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.prospect_name || "Inconnu"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {activity.prospect_email || ""}
                    {activity.source && ` • ${activity.source}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">
                    {new Date(activity.occurred_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(activity.occurred_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
