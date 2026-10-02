import { PageHero } from "@workspace/tenant-ui";

export default function LeCabinet() {
  return (
    <div className="bg-white">
      <PageHero
        title="Une expertise indépendante au service de votre patrimoine"
        subtitle="SYLK Conseils est un cabinet de conseil en gestion de patrimoine dédié aux dirigeants, cadres supérieurs et familles."
      />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed">
          <p>
            Fondé en 2019, SYLK Conseils accompagne une clientèle exigeante dans la structuration,
            la sécurisation et la transmission de leur patrimoine. Notre indépendance nous permet de
            recommander les solutions les plus adaptées à chaque situation, sans contrainte
            d&apos;appartenance.
          </p>

          <h2 className="heading-3 text-black tracking-tight mt-12 mb-6">Notre approche</h2>
          <p>
            Chaque accompagnement débute par un diagnostic approfondi de votre situation
            patrimoniale, fiscale et familiale. Cette analyse nous permet d&apos;identifier les
            leviers d&apos;optimisation disponibles et de construire une stratégie cohérente avec
            vos objectifs.
          </p>

          <p>
            Notre méthodologie repose sur une ingénierie patrimoniale rigoureuse, combinant
            expertise juridique, fiscale et financière. Nous assurons un suivi régulier pour adapter
            la stratégie aux évolutions de votre situation personnelle et professionnelle.
          </p>

          <h2 className="heading-3 text-black tracking-tight mt-12 mb-6">
            Nos domaines d&apos;intervention
          </h2>
          <p>
            Optimisation fiscale, structuration de holding, gestion de l&apos;épargne et des
            investissements, préparation de la retraite, transmission du patrimoine professionnel et
            privé — notre cabinet intervient sur l&apos;ensemble des dimensions de la gestion
            patrimoniale.
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
