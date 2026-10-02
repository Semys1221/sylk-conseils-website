"use client";

import { useState, useEffect } from "react";
import { Users, CalendarCheck, CheckSquare, TrendingUp, Download, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface KpiData {
  leads: { total: number; thisMonth: number; today: number };
  appointments: { total: number; upcoming: number; completed: number };
  tasks: { total: number; active: number; done: number; completionRate: number };
}

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const TOOLTIP_STYLE = {
  content: ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-lg px-3 py-2.5 text-xs shadow-lg">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="font-medium text-gray-900">
            {entry.name}:{" "}
            {typeof entry.value === "number" ? entry.value.toLocaleString("fr-FR") : entry.value}
          </p>
        ))}
      </div>
    );
  },
};

function StatRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
      </div>
    </div>
  );
}

export function DataView({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/kpi?tenant_id=${tenantId}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-gray-300 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        Erreur de chargement des données
      </div>
    );
  }

  const pieData = [
    { name: "Leads", value: data.leads.total },
    { name: "RDV", value: data.appointments.total },
    { name: "Tâches", value: data.tasks.total },
  ];

  const monthlyData = [
    { name: "Leads (mois)", valeur: data.leads.thisMonth },
    { name: "RDV (mois)", valeur: data.appointments.completed },
    { name: "Tâches (mois)", valeur: data.tasks.done },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Mes données</h2>
          <p className="text-sm text-gray-500">Analyse détaillée de votre activité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Répartition</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Activité du mois</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="valeur" radius={[6, 6, 0, 0]} barSize={36}>
                {monthlyData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Statistiques détaillées</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Leads</p>
            <StatRow label="Total" value={data.leads.total} total={data.leads.total} />
            <StatRow label="Ce mois" value={data.leads.thisMonth} total={data.leads.total} />
            <StatRow label="Aujourd'hui" value={data.leads.today} total={data.leads.total} />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Rendez-vous
            </p>
            <StatRow
              label="Total"
              value={data.appointments.total}
              total={data.appointments.total}
            />
            <StatRow
              label="À venir"
              value={data.appointments.upcoming}
              total={data.appointments.total}
            />
            <StatRow
              label="Terminés"
              value={data.appointments.completed}
              total={data.appointments.total}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Tâches
            </p>
            <StatRow label="Total" value={data.tasks.total} total={data.tasks.total} />
            <StatRow label="Actives" value={data.tasks.active} total={data.tasks.total} />
            <StatRow label="Terminées" value={data.tasks.done} total={data.tasks.total} />
          </div>
        </div>
      </div>
    </div>
  );
}
