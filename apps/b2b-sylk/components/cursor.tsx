"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${posRef.current.x - 12}px, ${posRef.current.y - 12}px)`;
        }
        rafRef.current = null;
      });
    };

    const grow = () => cursorRef.current?.classList.add("scale-150", "opacity-60");
    const shrink = () => cursorRef.current?.classList.remove("scale-150", "opacity-60");

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, [role=button]").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      document.querySelectorAll("a, button, [role=button]").forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none w-6 h-6 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm mix-blend-difference transition-[transform,opacity] duration-200 ease-out hidden lg:block"
    />
  );
}
