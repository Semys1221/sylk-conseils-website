import { PageHero } from "@workspace/tenant-ui";

export default function Patrimoine() {
  return (
    <div className="bg-white">
      <PageHero
        title="Gestion et structuration patrimoniale"
        subtitle="Une approche globale pour construire, sécuriser et transmettre votre patrimoine."
      />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed">
          <p>
            La gestion de patrimoine ne se limite pas à une simple allocation d&apos;actifs. Elle
            nécessite une vision globale intégrant les dimensions fiscales, juridiques, financières
            et familiales propres à chaque situation.
          </p>

          <p>
            Notre cabinet vous accompagne dans la structuration de votre patrimoine privé et
            professionnel : choix des véhicules d&apos;investissement, optimisation de
            l&apos;endettement, diversification des actifs, préparation de la retraite et
            organisation de la transmission.
          </p>

          <h3 className="heading-4 text-black tracking-tight mt-12 mb-6">
            Une stratégie sur mesure
          </h3>
          <p>
            Chaque situation patrimoniale est unique. Nous construisons avec vous une stratégie
            personnalisée, fondée sur une analyse approfondie de vos objectifs, de votre profil de
            risque et de vos contraintes.
          </p>

          <p>
            Notre mission est de vous apporter les clés pour prendre les décisions les plus adaptées
            à votre situation, dans une perspective de long terme.
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
