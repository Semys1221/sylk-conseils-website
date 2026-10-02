import { PageHero } from "@workspace/tenant-ui";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bookmark, Clock } from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1,
    category: "Fiscalité",
    title: "Loi de finances 2026 : les mesures clés pour les dirigeants",
    excerpt:
      "Plafonds d'investissement, évolution du barème de l'IR, ajustement de l'IFI et nouvelles obligations déclaratives : ce qu'il faut retenir pour votre stratégie patrimoniale.",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min",
    date: "8 Juin 2026",
  },
  {
    id: 2,
    category: "Retraite",
    title: "PER individuel ou collectif : lequel choisir en 2026 ?",
    excerpt:
      "Avec la montée en charge de la réforme des retraites, le choix du bon support d'épargne retraite devient déterminant pour optimiser vos revenus futurs et votre fiscalité.",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "1 Juin 2026",
  },
  {
    id: 3,
    category: "Transmission",
    title: "Donation avant décès : les abattements à ne pas manquer",
    excerpt:
      "Anticiper la transmission de son patrimoine permet de bénéficier d'abattements renouvelables tous les 15 ans. Une stratégie trop souvent négligée par les chefs d'entreprise.",
    img: "https://images.unsplash.com/photo-1607863680198-23d4b2565df3?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min",
    date: "25 Mai 2026",
  },
  {
    id: 4,
    category: "Immobilier",
    title: "LMNP après la réforme : la location meublée a-t-elle encore un avenir ?",
    excerpt:
      "Les récents ajustements fiscaux sur le régime LMNP rebattent les cartes de l'investissement locatif. Décryptage des opportunités qui subsistent pour les investisseurs avisés.",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "18 Mai 2026",
  },
  {
    id: 5,
    category: "Fiscalité Internationale",
    title: "Expatriation et optimisation fiscale : anticiper avant le départ",
    excerpt:
      "La gestion du patrimoine en contexte international nécessite une préparation minutieuse en amont du transfert de domicile fiscal pour éviter une double imposition et optimiser sa situation.",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min",
    date: "11 Mai 2026",
  },
  {
    id: 6,
    category: "Assurance-Vie",
    title: "Fonds euros vs unités de compte : quelle stratégie en 2026 ?",
    excerpt:
      "Avec des rendements fonds euros en légère remontée mais une inflation toujours présente, l'arbitrage entre sécurité et performance reste au cœur de toute stratégie d'assurance-vie.",
    img: "https://images.unsplash.com/photo-1565514020179-026b5f1d6ad0?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min",
    date: "4 Mai 2026",
  },
  {
    id: 7,
    category: "Investissement",
    title: "SCPI et pierre papier : investir dans l'immobilier sans contrainte",
    excerpt:
      "Les SCPI confirment leur attractivité en 2026 avec des rendements stables et une diversification sectorielle croissante. Une solution adaptée aux profils recherchant un revenu complémentaire.",
    img: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "27 Avril 2026",
  },
  {
    id: 8,
    category: "Stratégie Fiscale",
    title: "Optimiser la cession de votre entreprise en 2026",
    excerpt:
      "Anticiper les événements de liquidité est crucial pour éviter de subir une pression fiscale inadaptée et sécuriser la transition de votre patrimoine professionnel.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "14 Mai 2026",
  },
  {
    id: 9,
    category: "Ingénierie Patrimoniale",
    title: "L'art de la structuration en holding familiale",
    excerpt:
      "Découvrez comment l'outil sociétaire permet de centraliser la gouvernance de vos investissements tout en fluidifiant la transmission intergénérationnelle.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    readTime: "7 min",
    date: "28 Avril 2026",
  },
  {
    id: 10,
    category: "Réglementation",
    title: "Évolutions de l'IFI : ce qui change pour les non-résidents",
    excerpt:
      "Une analyse chirurgicale des dernières évolutions législatives et de leur impact direct sur l'immobilier détenu via des structures sociétaires complexes.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min",
    date: "10 Avril 2026",
  },
  {
    id: 11,
    category: "Stratégie Patrimoniale",
    title: "Inflation et épargne : adapter sa stratégie en période de tension",
    excerpt:
      "Face à une inflation persistante et des taux d'intérêt élevés, la préservation du pouvoir d'achat et la recherche de rendement réel imposent une refonte des allocations traditionnelles.",
    img: "https://images.unsplash.com/photo-1616077168070-5cb5f5f0c0e0?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "12 Novembre 2024",
  },
  {
    id: 12,
    category: "Fiscalité",
    title: "Loi de finances 2025 : ce qu'il faut anticiper dès maintenant",
    excerpt:
      "Les grandes orientations du prochain budget se dessinent. Anticiper les mesures fiscales à venir permet d'optimiser ses décisions de fin d'année et de sécuriser ses avantages.",
    img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min",
    date: "8 Octobre 2024",
  },
  {
    id: 13,
    category: "Retraite",
    title: "Réforme des retraites 2023 : quel impact sur votre planning patrimonial ?",
    excerpt:
      "Le recul de l'âge légal et l'évolution des règles de calcul rebattent les cartes de la planification retraite. Une mise à jour de votre stratégie d'épargne est plus que jamais nécessaire.",
    img: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "25 Mai 2023",
  },
  {
    id: 14,
    category: "Assurance-Vie",
    title: "Assurance-vie en 2023 : arbitrer entre sécurité et performance",
    excerpt:
      "Entre remontée des taux et volatilité des marchés, l'assurance-vie reste un pilier de la gestion patrimoniale. Analyse des stratégies d'arbitrage pour un couple rendement-risque optimisé.",
    img: "https://images.unsplash.com/photo-1553729459-afe8f2e2b2b4?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min",
    date: "14 Mars 2023",
  },
  {
    id: 15,
    category: "Transmission",
    title: "Démembrement de propriété : une solution pour anticiper sa succession",
    excerpt:
      "Le démembrement croisé et la donation temporaire d'usufruit sont des outils puissants pour transmettre son patrimoine tout en conservant des revenus. Une technique trop peu exploitée.",
    img: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min",
    date: "6 Septembre 2022",
  },
  {
    id: 16,
    category: "Investissement",
    title: "Private equity et non-coté : investir dans l'économie réelle",
    excerpt:
      "Le capital-investissement séduit une clientèle patrimoniale croissante en quête de diversification et de rendement. Décryptage des véhicules d'investissement et de leurs spécificités fiscales.",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min",
    date: "20 Février 2022",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <PageHero
        title="Perspectives & Insights"
        subtitle="S'approprier la gestion de ses sujets privés est la quintessence de ceux qui avancent."
      />

      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="max-w-3xl mx-auto space-y-8 text-lead text-neutral-800 leading-relaxed text-center mb-24">
          <p className="text-muted font-light">
            Nous partageons nos analyses, dossiers techniques et décryptages pour vous permettre
            d&apos;appréhender, avec acuité et sérénité, les évolutions fiscales et
            l&apos;architecture de nos marchés de capitaux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-full aspect-[4/3] bg-neutral-100 rounded-2xl mb-6 overflow-hidden relative">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex items-center gap-3 text-small font-semibold tracking-wider text-blue-600 uppercase mb-3">
                  <Bookmark size={12} />
                  {post.category}
                </div>

                <h3 className="heading-4 text-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-small text-neutral-500 leading-relaxed mb-6">{post.excerpt}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-small text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>{post.readTime} de lecture</span>
                </div>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
