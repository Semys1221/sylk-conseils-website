import { PageHero } from "@workspace/tenant-ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ExpertisesHub() {
  return (
    <div className="bg-white">
      <PageHero
        title="Nos domaines d'expertise"
        subtitle="Une ingénierie patrimoniale complète au service de vos objectifs."
      />

      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link href="/expertises/fiscalite" className="group block h-full">
            <div className="bg-neutral-50 rounded-3xl p-10 h-full border border-neutral-100 hover:border-black/5 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="heading-3 text-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                  Stratégie Fiscale
                </h3>
                <p className="text-lead text-neutral-500 leading-relaxed mb-12">
                  Optimisation de la fiscalité des revenus, du patrimoine et de la transmission dans
                  le respect du cadre légal.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                Découvrir
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/expertises/patrimoine" className="group block h-full">
            <div className="bg-neutral-50 rounded-3xl p-10 h-full border border-neutral-100 hover:border-black/5 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="heading-3 text-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                  Gestion de Patrimoine
                </h3>
                <p className="text-lead text-neutral-500 leading-relaxed mb-12">
                  Structuration, sécurisation et diversification des actifs patrimoniaux.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                Découvrir
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/expertises/transmission" className="group block h-full">
            <div className="bg-neutral-50 rounded-3xl p-10 h-full border border-neutral-100 hover:border-black/5 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="heading-3 text-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                  Transmission
                </h3>
                <p className="text-lead text-neutral-500 leading-relaxed mb-12">
                  Préparez et sécurisez la transmission de vos biens dans les meilleures conditions.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                Découvrir
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/expertises/retraite" className="group block h-full">
            <div className="bg-neutral-50 rounded-3xl p-10 h-full border border-neutral-100 hover:border-black/5 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="heading-3 text-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                  Retraite
                </h3>
                <p className="text-lead text-neutral-500 leading-relaxed mb-12">
                  Anticipez et construisez une stratégie retraite adaptée à vos objectifs de vie.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                Découvrir
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
