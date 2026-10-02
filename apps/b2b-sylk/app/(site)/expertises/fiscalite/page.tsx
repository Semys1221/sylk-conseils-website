import { PageHero } from "@workspace/tenant-ui";

export default function Fiscalite() {
  return (
    <div className="bg-white">
      <PageHero
        title="Optimisation et stratégie fiscale"
        subtitle="Une ingénierie fiscale rigoureuse pour maîtriser votre charge d'impôt dans le respect du cadre légal."
      />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed">
          <p>
            Pour un dirigeant ou un cadre supérieur, la charge fiscale représente souvent le premier
            poste de dépense. Une approche proactive de la fiscalité permet d&apos;optimiser cette
            situation et de réorienter les capitaux vers des objectifs patrimoniaux structurants.
          </p>

          <p>
            Notre cabinet vous accompagne dans l&apos;identification et la mise en œuvre des
            dispositifs légaux adaptés à votre situation : optimisation de l&apos;impôt sur le
            revenu, gestion des plus-values, stratégie de rémunération, fiscalité immobilière et
            internationale.
          </p>

          <h3 className="heading-4 text-black tracking-tight mt-12 mb-6">
            Une démarche structurée
          </h3>
          <p>
            L&apos;optimisation fiscale repose sur une planification rigoureuse et une connaissance
            approfondie des textes en vigueur. Notre rôle est de vous apporter une vision claire des
            options disponibles et de leurs implications.
          </p>

          <p>
            Nous construisons avec vous une stratégie fiscale cohérente, évolutive et adaptée à
            l&apos;ensemble de vos objectifs patrimoniaux, professionnels et familiaux.
          </p>

          <p className="pt-8">
            <span className="font-medium text-black">
              Les décisions qui façonnent l&apos;avenir se prennent aujourd&apos;hui.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
