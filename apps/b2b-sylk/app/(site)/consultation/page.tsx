import { PageHero } from "@workspace/tenant-ui";
import { ArrowRight } from "lucide-react";

export default function Consultation() {
  return (
    <div className="bg-white">
      <PageHero
        title="Session Stratégique Privée"
        subtitle="Un temps dédié pour structurer, avec clarté et précision, l'architecture de vos futurs succès financiers."
      />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed text-center">
          <p>
            Nous prenons l&apos;investissement de nos partenaires extrêmement au sérieux. Pour
            qu&apos;une session stratégique soit à la mesure de vos attentes et produise la clarté
            nécessaire, elle ne doit souffrir d&apos;aucune précipitation.
          </p>

          <p>
            Nous vous invitons à sélectionner un créneau horaire où vous serez dans de bonnes
            dispositions, au calme, et suffisamment disponible pour parler librement avec du temps
            devant vous. C&apos;est dans cette sérénité que naissent les stratégies les plus
            décisives.
          </p>

          <div className="pt-12 pb-16">
            <a
              href="https://decouverte.sylkconseils.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#111111] hover:bg-black transition-all text-white rounded-full pl-8 pr-3 py-3 text-sm font-medium group mx-auto w-fit"
            >
              Réserver ma session privée
              <div className="bg-white text-black p-2 rounded-full transition-transform group-hover:translate-x-1">
                <ArrowRight size={14} />
              </div>
            </a>
          </div>

          <p className="pt-8 text-muted border-t border-neutral-100">
            <span className="font-medium text-black">
              Les décisions qui façonnent l&apos;avenir se prennent aujourd&apos;hui.
            </span>
            <br />
            <br />
            Bonne journée !!!
          </p>
        </div>
      </section>
    </div>
  );
}
