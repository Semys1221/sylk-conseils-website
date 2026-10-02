import Link from "next/link";

export default function ExpertisesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-[#0a0a0f] pt-24 pb-4 border-b border-white/10 relative z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-8 text-sm font-medium text-white/60 overflow-x-auto px-6">
          <Link href="/expertises" className="hover:text-white transition-colors whitespace-nowrap">
            Vue d&apos;ensemble
          </Link>
          <Link
            href="/expertises/fiscalite"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Stratégie Fiscale
          </Link>
          <Link
            href="/expertises/patrimoine"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Gestion de Patrimoine
          </Link>
          <Link
            href="/expertises/transmission"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Transmission
          </Link>
          <Link
            href="/expertises/retraite"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Retraite
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
