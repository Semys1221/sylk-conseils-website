"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ProjectionChartProps {
  currentData?: number[];
  projectedData?: number[];
  years?: number[];
}

export default function ProjectionChart({
  currentData,
  projectedData,
  years,
}: ProjectionChartProps) {
  const defaultCurrent = [500, 520, 540, 565, 590, 615, 640, 670, 700, 730];
  const defaultProjected = [500, 560, 630, 710, 800, 900, 1020, 1150, 1300, 1470];
  const defaultYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const data = (years ?? defaultYears).map((y, i) => ({
    annee: `${y}`,
    "Sans changement": (currentData ?? defaultCurrent)[i] / 1000,
    "Avec stratégie": (projectedData ?? defaultProjected)[i] / 1000,
  }));

  const gain = (projectedData ?? defaultProjected)[9] - (currentData ?? defaultCurrent)[9];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Projection patrimoniale
        </h4>
        <span className="text-xs text-emerald-400 font-semibold">
          +{(gain / 1000).toFixed(0)}k € sur 10 ans
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="annee"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickFormatter={(v) => `${v}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value).toFixed(1)}k €`]}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
          <Line
            type="monotone"
            dataKey="Sans changement"
            stroke="#64748b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Avec stratégie"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
