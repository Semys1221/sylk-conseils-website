"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PatrimonyChartProps {
  answers: Record<string, string>;
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const KEYWORDS: Record<string, { label: string; color: string }> = {
  immobilier: { label: "Immobilier", color: "#3b82f6" },
  "assurance-vie": { label: "Assurance-Vie", color: "#22c55e" },
  av: { label: "Assurance-Vie", color: "#22c55e" },
  livret: { label: "Livrets", color: "#f59e0b" },
  pea: { label: "PEA", color: "#ef4444" },
  per: { label: "PER", color: "#8b5cf6" },
  scpi: { label: "SCPI", color: "#ec4899" },
  action: { label: "Actions", color: "#14b8a6" },
  compte: { label: "Comptes Titres", color: "#f97316" },
};

function parsePatrimony(text: string): Record<string, number> {
  const result: Record<string, number> = {};
  const lower = text.toLowerCase();

  for (const [keyword, info] of Object.entries(KEYWORDS)) {
    if (lower.includes(keyword)) {
      const match = text.match(new RegExp(`${keyword}[^0-9]*(\\d+[\\s\\d]*(?:€|k|m|K|M))`, "i"));
      if (match) {
        const val = match[1]
          .replace(/[^0-9.,]/g, "")
          .replace(",", ".")
          .replace(/\s/g, "");
        const num = parseFloat(val);
        if (!isNaN(num)) {
          const finalVal = match[1].toLowerCase().includes("m")
            ? num * 1000000
            : match[1].toLowerCase().includes("k")
              ? num * 1000
              : num;
          result[info.label] = (result[info.label] || 0) + finalVal;
        }
      } else {
        result[info.label] = (result[info.label] || 0) + 1;
      }
    }
  }

  if (Object.keys(result).length === 0) {
    result["Non spécifié"] = 1;
  }

  return result;
}

export default function PatrimonyChart({ answers }: PatrimonyChartProps) {
  const data = useMemo(() => {
    const text = answers.patrimoine ?? "";
    const parsed = parsePatrimony(text);
    return Object.entries(parsed).map(([name, value], i) => ({
      name,
      value,
      color: KEYWORDS[name.toLowerCase()]?.color ?? COLORS[i % COLORS.length],
    }));
  }, [answers.patrimoine]);

  if (data.length === 1 && data[0].name === "Non spécifié") {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Renseignez le champ patrimoine pour voir le graphique
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Répartition du patrimoine
      </h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} €`, "Montant"]}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-xs text-slate-500 mt-1">
        Total estimé : {total.toLocaleString("fr-FR")} €
      </p>
    </div>
  );
}
