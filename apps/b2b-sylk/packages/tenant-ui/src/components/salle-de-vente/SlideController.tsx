"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

interface SlideControllerProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  slideCount?: number;
}

export function SlideController({
  currentSlide,
  onSlideChange,
  slideCount = 6,
}: SlideControllerProps) {
  const [pusherError, setPusherError] = useState(false);

  const handleChange = async (newIndex: number) => {
    onSlideChange(newIndex);
    try {
      const res = await fetch("/api/slides/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideIndex: newIndex }),
      });
      if (!res.ok) throw new Error("Pusher broadcast failed");
      setPusherError(false);
    } catch (e) {
      console.error("Failed to broadcast slide change:", e);
      setPusherError(true);
    }
  };

  return (
    <div className="border-t border-white/5 bg-[#0a1022]/60 px-8 py-4 flex items-center justify-between gap-4 shrink-0">
      <span className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-mono">Mode Présentateur</span>
        {pusherError && (
          <span className="text-[10px] text-amber-400 flex items-center gap-1">
            <AlertTriangle size={10} />
            Échec synchro
          </span>
        )}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleChange(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: slideCount }, (_, i) => (
            <button
              key={i}
              onClick={() => handleChange(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-[#8cb4e6] w-4" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => handleChange(Math.min(slideCount - 1, currentSlide + 1))}
          disabled={currentSlide === slideCount - 1}
          className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <span className="text-xs text-slate-600 font-mono">
        {currentSlide + 1} / {slideCount}
      </span>
    </div>
  );
}
