import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  deltaPositive,
  icon: Icon,
  iconColor = "text-blue-400",
  iconBg = "bg-blue-500/10",
}: KpiCardProps) {
  return (
    <div className="bg-[#0f1629] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={15} className={iconColor} />
        </div>
      </div>

      <div>
        <p className="text-3xl font-light text-white tracking-tight">{value}</p>
        {delta && (
          <p
            className={`text-xs mt-1.5 font-medium ${deltaPositive ? "text-emerald-400" : "text-red-400"}`}
          >
            {deltaPositive ? "↑" : "↓"} {delta} vs mois précédent
          </p>
        )}
      </div>
    </div>
  );
}
