import { PageHero } from "@workspace/tenant-ui";

export default function Retraite() {
  return (
    <div className="bg-white">
      <PageHero
        title="Préparation et stratégie retraite"
        subtitle="Anticipez et construisez une stratégie retraite adaptée à vos objectifs de vie."
      />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed">
          <p>
            La préparation de la retraite est un enjeu majeur pour les dirigeants et cadres
            supérieurs. Entre les régimes obligatoires et les dispositifs d&apos;épargne
            individuelle, il est essentiel de définir une stratégie cohérente pour maintenir son
            niveau de vie et réaliser ses projets.
          </p>

          <p>
            Notre cabinet vous accompagne dans l&apos;élaboration de votre stratégie retraite :
            optimisation des dispositifs PER et Madelin, arbitrage entre enveloppes fiscales,
            pilotage des revenus futurs et articulation avec votre patrimoine global.
          </p>

          <h3 className="heading-4 text-black tracking-tight mt-12 mb-6">
            Une approche prospective
          </h3>
          <p>
            Chaque projet de retraite est unique. Nous réalisons avec vous une analyse prospective
            pour définir les leviers d&apos;épargne et d&apos;investissement les plus adaptés à
            votre horizon et à vos objectifs.
          </p>

          <p>
            Notre rôle est de vous donner les moyens de construire sereinement votre avenir, en
            conjuguant performance financière et sécurité patrimoniale.
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
