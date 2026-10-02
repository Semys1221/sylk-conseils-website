import { PageHero } from "@workspace/tenant-ui";

export default function MentionsLegales() {
  return (
    <div className="bg-white">
      <PageHero title="Mentions Légales" />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-neutral-700 text-base leading-relaxed">
          <h2 className="heading-4 text-black">Éditeur du site</h2>
          <p>
            SYLK Conseils, Société par Actions Simplifiée (SAS) au capital de 1 000 Euros.
            <br />
            Siège social : Lyon
            <br />
            RCS Lyon 879 235 521 — SIRET 879 235 521 00017 — NAF 7022 Z
            <br />
            Tél. : 06.16.84.95.61
            <br />
            Email : direction@sylkconseils.com
          </p>

          <h2 className="heading-4 text-black">Agréments et Immatriculations</h2>
          <p>
            ORIAS n°1900 8912 — Conseiller en Investissements Financiers (CIF) enregistré auprès de
            la CNCEF, association agréée par l&apos;AMF.
            <br />
            <br />
            Carte Transaction sur Immeubles n° CPI69 012020 000 045246 enregistrée auprès de la CCI
            de Lyon Métropole.
            <br />
            <br />
            Courtier d&apos;assurance, mandataire d&apos;assurance, sous le contrôle de l&apos;ACPR.
          </p>

          <h2 className="heading-4 text-black">Garanties et Assurances</h2>
          <p>
            Responsabilité Civile Professionnelle et Garantie Financière souscrites auprès de MMA
            IARD — n°112 788 909.
          </p>

          <h2 className="heading-4 text-black">Hébergement</h2>
          <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA.</p>

          <h2 className="heading-4 text-black">Propriété Intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos) est soumis à la
            législation française et internationale sur le droit d&apos;auteur. Toute reproduction
            est strictement interdite sans notre accord préalable.
          </p>
        </div>
      </section>
    </div>
  );
}
