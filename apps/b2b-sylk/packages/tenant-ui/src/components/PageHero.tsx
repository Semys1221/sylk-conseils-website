"use client";

import { useTenant } from "../tenant-config";

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useTenant();

  return (
    <section
      className="pt-24 pb-24 px-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-6 text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
