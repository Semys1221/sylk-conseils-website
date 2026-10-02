"use client";

import {
  AreaChart,
  Area,
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

interface AnalyticsChartProps {
  data: DataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString("fr-FR")}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="pageviewsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />

        <XAxis
          dataKey="date"
          tick={{ fill: "#475569", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
        />

        <Area
          type="monotone"
          dataKey="pageviews"
          name="Pageviews"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#pageviewsGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#3b82f6", stroke: "#0a0e1a", strokeWidth: 2 }}
        />

        <Area
          type="monotone"
          dataKey="sessions"
          name="Sessions"
          stroke="#8b5cf6"
          strokeWidth={2}
          fill="url(#sessionsGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#0a0e1a", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
