"use client";

interface GlassCardProps {
  children: React.ReactNode;
}

export function GlassCard({ children }: GlassCardProps) {
  return (
    <div className="relative z-30 w-[90vw] sm:w-[75vw] lg:w-[60vw] max-w-4xl h-[85vh] sm:h-[75vh] lg:h-[78vh] max-h-[750px]">
      <div className="relative w-full h-full rounded-2xl border border-slate-100/50 shadow-2xl flex flex-col overflow-hidden p-4 md:p-6">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "url(https://upload.wikimedia.org/wikipedia/commons/8/8f/Blue_City_od_strony_Alej_Jerozolimskich_2018.jpg)",
            filter: "blur(40px)",
          }}
        />
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10 flex flex-col flex-1">{children}</div>
      </div>
    </div>
  );
}
