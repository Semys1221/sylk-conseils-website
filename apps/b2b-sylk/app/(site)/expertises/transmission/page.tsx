import { PageHero } from "@workspace/tenant-ui";

export default function Transmission() {
  return (
    <div className="bg-white">
      <PageHero
        title="Transmission et succession"
        subtitle="Préparez et sécurisez la transmission de votre patrimoine dans les meilleures conditions."
      />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed">
          <p>
            La transmission d&apos;un patrimoine est un moment clé qui nécessite une préparation
            rigoureuse. Anticiper les aspects juridiques et fiscaux permet de transmettre dans les
            meilleures conditions, en préservant l&apos;équilibre familial et la pérennité des
            actifs.
          </p>

          <p>
            Notre cabinet vous accompagne dans l&apos;organisation de votre succession : donation,
            pacte Dutreil, assurance-vie, démembrement de propriété. Chaque outil a ses spécificités
            et doit être choisi en fonction de votre situation personnelle et patrimoniale.
          </p>

          <h3 className="heading-4 text-black tracking-tight mt-12 mb-6">
            Une transmission maîtrisée
          </h3>
          <p>
            Une stratégie de transmission efficace repose sur une vision à long terme et une
            connaissance fine du cadre juridique. Nous vous aidons à arbitrer entre les différents
            dispositifs pour optimiser la transmission de votre patrimoine.
          </p>

          <p>
            Notre mission est de vous permettre de transmettre sereinement, en garantissant la
            protection de vos proches et la valorisation de votre héritage.
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
