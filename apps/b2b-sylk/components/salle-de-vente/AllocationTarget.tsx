"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface AllocationTargetProps {
  currentAllocation?: Record<string, number>;
  recommendedAllocation?: Record<string, number>;
  onAdjust?: (allocation: Record<string, number>) => void;
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function AllocationTarget({
  currentAllocation = { "Fonds Euros": 60, Livrets: 25, "Compte Titres": 15 },
  recommendedAllocation = { "Assurance-Vie UC": 30, PEA: 25, PER: 20, SCPI: 15, "Fonds Euros": 10 },
  onAdjust,
}: AllocationTargetProps) {
  const currentData = useMemo(
    () =>
      Object.entries(currentAllocation).map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length],
      })),
    [currentAllocation]
  );

  const recommendedData = useMemo(
    () =>
      Object.entries(recommendedAllocation).map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length],
      })),
    [recommendedAllocation]
  );

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Allocation cible
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] text-slate-500 mb-2 text-center uppercase tracking-wider">
            Actuelle
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {currentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: "10px", color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-[10px] text-slate-500 mb-2 text-center uppercase tracking-wider">
            Recommandée
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={recommendedData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {recommendedData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: "10px", color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
