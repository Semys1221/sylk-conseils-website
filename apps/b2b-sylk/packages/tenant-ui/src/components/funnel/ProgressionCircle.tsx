"use client";

import { motion } from "motion/react";

interface ProgressionCircleProps {
  current: number;
  total: number;
}

export function ProgressionCircle({ current, total }: ProgressionCircleProps) {
  const progress = total > 0 ? current / total : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-40 h-40">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="54" stroke="#E4E1DC" strokeWidth="3" className="opacity-50" />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            stroke="#111111"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[2.5rem] font-bold text-[#111111] leading-none">{current}</span>
          <span className="text-sm text-[#999999] font-medium mt-1">/ {total}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[#999999] text-xs font-medium uppercase tracking-widest">Complété</p>
        <p className="text-[#111111] text-sm font-semibold mt-0.5">{Math.round(progress * 100)}%</p>
      </div>
    </div>
  );
}
