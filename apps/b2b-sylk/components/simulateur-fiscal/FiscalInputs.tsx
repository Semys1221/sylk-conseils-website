"use client";

interface FiscalInputsProps {
  tmi: number;
  revenus: number;
  epargne: number;
  onChange: (field: "tmi" | "revenus" | "epargne", value: number) => void;
}

export default function FiscalInputs({ tmi, revenus, epargne, onChange }: FiscalInputsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tranche marginale d'imposition (TMI)
          </label>
          <span className="text-sm text-white font-semibold">{tmi}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={45}
          step={1}
          value={tmi}
          onChange={(e) => onChange("tmi", Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>0%</span>
          <span>11%</span>
          <span>30%</span>
          <span>41%</span>
          <span>45%</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Revenus imposables annuels
          </label>
          <span className="text-sm text-white font-semibold">
            {revenus.toLocaleString("fr-FR")} €
          </span>
        </div>
        <input
          type="range"
          min={30000}
          max={500000}
          step={5000}
          value={revenus}
          onChange={(e) => onChange("revenus", Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>30k</span>
          <span>500k</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Épargne mensuelle
          </label>
          <span className="text-sm text-white font-semibold">
            {epargne.toLocaleString("fr-FR")} €
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10000}
          step={100}
          value={epargne}
          onChange={(e) => onChange("epargne", Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>0 €</span>
          <span>10 000 €</span>
        </div>
      </div>
    </div>
  );
}
