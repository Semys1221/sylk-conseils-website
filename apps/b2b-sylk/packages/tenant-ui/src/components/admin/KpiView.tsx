"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CalendarCheck,
  CheckSquare,
  TrendingUp,
  MousePointerClick,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface KpiData {
  leads: { total: number; thisMonth: number; today: number };
  appointments: { total: number; upcoming: number; completed: number };
  tasks: { total: number; active: number; done: number; completionRate: number };
}

const TOOLTIP_STYLE = {
  content: ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-lg px-3 py-2.5 text-xs shadow-lg">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="font-medium text-gray-900">
            {entry.name}: {entry.value.toLocaleString("fr-FR")}
          </p>
        ))}
      </div>
    );
  },
};

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${iconBg} p-2.5 rounded-xl`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export function KpiView({ tenantId }: { tenantId: string }) {
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
      <div className="text-center py-20 text-gray-400 text-sm">Erreur de chargement des KPI</div>
    );
  }

  const chartData = [
    { name: "Leads", valeur: data.leads.total, fill: "#3b82f6" },
    { name: "RDV", valeur: data.appointments.total, fill: "#8b5cf6" },
    { name: "Tâches", valeur: data.tasks.total, fill: "#10b981" },
  ];

  const conversionData = [
    { name: "Leads", valeur: data.leads.total, fill: "#3b82f6" },
    { name: "RDV confirmés", valeur: data.appointments.completed, fill: "#8b5cf6" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Indicateurs clés</h2>
        <p className="text-sm text-gray-500">Vue d&apos;ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Leads ce mois"
          value={data.leads.thisMonth}
          sub={`${data.leads.today} aujourd'hui · ${data.leads.total} total`}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          label="Rendez-vous à venir"
          value={data.appointments.upcoming}
          sub={`${data.appointments.completed} terminés · ${data.appointments.total} total`}
          icon={CalendarCheck}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <KpiCard
          label="Tâches actives"
          value={data.tasks.active}
          sub={`${data.tasks.done} terminées · ${data.tasks.completionRate}% complétion`}
          icon={CheckSquare}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          label="Taux de complétion"
          value={`${data.tasks.completionRate}%`}
          sub={`${data.tasks.done}/${data.tasks.total} tâches`}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Volume d'activité</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="valeur" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Entonnoir de conversion</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={conversionData}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="valeur" radius={[0, 6, 6, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
