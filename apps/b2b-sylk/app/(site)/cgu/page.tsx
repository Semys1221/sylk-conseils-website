import { PageHero } from "@workspace/tenant-ui";

export default function Cgu() {
  return (
    <div className="bg-white">
      <PageHero title="Conditions Générales d'Utilisation" />

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-neutral-700 text-base leading-relaxed">
          <h2 className="heading-4 text-black">Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et
            l&apos;utilisation du site internet de SYLK Conseils, ci-après dénommé &laquo; le Site
            &raquo;. En accédant au Site, vous acceptez sans réserve les présentes CGU.
          </p>

          <h2 className="heading-4 text-black">Accès au Site</h2>
          <p>
            Le Site est accessible gratuitement à tout utilisateur disposant d&apos;un accès à
            Internet. Tous les frais relatifs à l&apos;accès au réseau, qu&apos;ils soient matériels
            ou logiciels, sont exclusivement à la charge de l&apos;utilisateur.
          </p>

          <h2 className="heading-4 text-black">Propriété Intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu du Site (textes, graphismes, logos, images, vidéos) est la
            propriété exclusive de SYLK Conseils, sauf mention contraire. Toute reproduction,
            distribution, modification ou exploitation de tout ou partie du Site sans
            l&apos;autorisation écrite préalable de SYLK Conseils est strictement interdite.
          </p>

          <h2 className="heading-4 text-black">Données Personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
            Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès, de rectification,
            de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces
            droits en nous contactant à l&apos;adresse email : direction@sylkconseils.com.
          </p>

          <h2 className="heading-4 text-black">Cookies</h2>
          <p>
            Le Site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. Des
            cookies analytiques peuvent également être utilisés, sous réserve de votre consentement
            préalable. Vous pouvez à tout moment paramétrer vos préférences en matière de cookies.
          </p>

          <h2 className="heading-4 text-black">Responsabilité</h2>
          <p>
            SYLK Conseils s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des
            informations publiées sur le Site. Toutefois, SYLK Conseils ne saurait garantir
            l&apos;exhaustivité ou l&apos;absence de modification par un tiers. La responsabilité de
            SYLK Conseils ne peut être engagée en cas de préjudice résultant de l&apos;utilisation
            du Site.
          </p>

          <h2 className="heading-4 text-black">Liens Hypertextes</h2>
          <p>
            Le Site peut contenir des liens vers des sites tiers. SYLK Conseils n&apos;exerce aucun
            contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou à leur
            accessibilité.
          </p>

          <h2 className="heading-4 text-black">Droit Applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux
            compétents seront ceux du ressort du siège social de SYLK Conseils.
          </p>
        </div>
      </section>
    </div>
  );
}
