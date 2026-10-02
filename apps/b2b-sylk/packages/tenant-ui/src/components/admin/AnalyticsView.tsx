"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  pageviews: number;
  sessions: number;
}

interface AnalyticsViewProps {}

function generatePlaceholderData(): DataPoint[] {
  const data: DataPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
    const base = 40 + Math.floor(Math.sin(i * 0.3) * 20);
    data.push({
      date: label,
      pageviews: base + Math.floor(Math.random() * 30),
      sessions: Math.floor((base + Math.floor(Math.random() * 20)) * 0.6),
    });
  }
  return data;
}

function AnalyticsChart({ data }: { data: DataPoint[] }) {
  if (!data?.length) return null;
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Line
            type="monotone"
            dataKey="pageviews"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsView(_props: AnalyticsViewProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();

        if (json.error) {
          setError(json.error);
          setData(generatePlaceholderData());
          return;
        }

        const results = json.data?.results as Array<{ days: string[]; data: number[] }> | undefined;
        if (results && results.length >= 2) {
          const parsed: DataPoint[] = results[0].days.map((day: string, i: number) => ({
            date: new Date(day).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
            pageviews: results[0].data[i] ?? 0,
            sessions: results[1]?.data[i] ?? 0,
          }));
          setData(parsed);
          setIsLive(true);
        } else {
          setData(generatePlaceholderData());
        }
      } catch (e) {
        setError(String(e));
        setData(generatePlaceholderData());
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-slate-600 animate-spin" />
      </div>
    );
  }

  const totalPageviews = data.reduce((s, d) => s + d.pageviews, 0);
  const totalSessions = data.reduce((s, d) => s + d.sessions, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Pageviews (30j)",
            value: totalPageviews.toLocaleString("fr-FR"),
            color: "text-blue-400",
          },
          {
            label: "Sessions (30j)",
            value: totalSessions.toLocaleString("fr-FR"),
            color: "text-violet-400",
          },
          {
            label: "Source",
            value: isLive ? "PostHog Live" : "Placeholder",
            color: isLive ? "text-emerald-400" : "text-orange-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0f1629] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-light ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f1629] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-white">Trafic — 30 derniers jours</h2>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>Pageviews
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span>Sessions
            </span>
          </div>
        </div>
        <AnalyticsChart data={data} />
      </div>

      {!isLive && (
        <p className="text-xs text-slate-700 text-center">
          {error
            ? `Erreur PostHog: ${error}`
            : "Données de démonstration — configurez POSTHOG_PERSONAL_API_KEY pour voir les vraies métriques."}
        </p>
      )}
    </div>
  );
}
