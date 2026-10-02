import type { TenantConfig } from "@workspace/tenant-ui";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/syli-conseils/optimiser-vos-avantages-en-tant-qu-independant-clone";

const config: TenantConfig = {
  id: "sylk-conseils",
  name: "SYLK Conseils",
  tagline: "Conseil en gestion de patrimoine",
  domain: "sylkconseils.com",
  logo: "/logo.jpg",
  contact: {
    email: "direction@sylkconseils.com",
  },
  colors: {
    bg: "#f8fafc",
    bgAlt: "#ffffff",
    bgGradientFrom: "#f0fdf4",
    bgGradientVia: "#ecfeff",
    bgGradientTo: "#f0f9ff",
    glow: "bg-teal-500/10",
    textMuted: "text-gray-400",
    textAccent: "text-teal-600",
    border: "border-gray-200",
    cardBg: "#ffffff",
  },
  socialProof: {
    linkedinCount: "+3 000",
    partnersCount: "+350",
    industriesCount: "15+",
    badgeText: "Cabinet indépendant",
    ratingText: "4.9/5 avis clients",
  },
  hero: {
    image: "",
    headline: "Votre patrimoine mérite",
    headlineAccent: "une stratégie sur-mesure",
    subtitle:
      "Conseil indépendant en gestion de patrimoine — optimisation fiscale, retraite & transmission.",
    ctaText: "Prendre rendez-vous",
    ctaLink: CALENDLY_URL,
    secondaryCtaText: "Découvrir nos services",
  },
  testimonials: {
    heading: "Ils nous font confiance",
    description: "Ce que nos clients disent de notre accompagnement.",
    items: [
      {
        quote:
          "Stéphane a approche méthodique et une expertise d'une clarté rare qui permettent enfin de piloter sa fiscalité en toute confiance.",
        author: "Pierre L.",
        title: "Dirigeant, Paris",
        initial: "P",
      },
      {
        quote:
          "Moi qui redoutais le côté rébarbatif de la gestion de patrimoine, j'ai découvert une démarche fluide, percutante et absolument captivante.",
        author: "Sophie M.",
        title: "Chef d'entreprise, Lyon",
        initial: "S",
      },
      {
        quote:
          "C'est structuré, c'est méthodique et surtout on comprend tout : on sent tout de suite le pro qui maîtrise son sujet à 100 %",
        author: "Marc R.",
        title: "Médecin, Bordeaux",
        initial: "M",
      },
    ],
  },
  funnel: {
    image: "",
    tenantId: "sylk-conseils",
    steps: [
      {
        id: "rdv",
        title: "Prendre rendez-vous",
        options: [{ id: "cal", label: "Choisir un créneau", value: "cal" }],
      },
    ],
    content: {
      landingTitle: "Votre bilan patrimonial",
      landingSubtitle: "Commençons par mieux vous connaître.",
      landingQuote: "Un patrimoine bien structuré est la clé de la sérénité financière.",
      landingQuoteAuthor: "Stéphane Lawnicki",
      landingCta: "Démarrer mon bilan",
      stepPrefix: "Étape",
      questionIntro: "Quelques questions pour mieux vous connaître :",
      qualifiedTitle: "Parfait !",
      qualifiedMessage:
        "Votre profil correspond parfaitement à notre expertise. Prenons rendez-vous.",
      qualifiedCta: "Réserver un appel",
      disqualifiedTitle: "Merci pour votre intérêt",
      disqualifiedMessage:
        "Votre situation nécessite une approche différente. Contactez-nous pour en discuter.",
      loadingText: "Analyse de votre profil...",
      showInlineCalendar: true,
    },
  },
  funnelHomeEnabled: false,
  calendlyUrl: CALENDLY_URL,
  dailyRoomUrl: "https://sylk-conseils.daily.co/sylk-decouverte",
  linkedinUrl: "https://www.linkedin.com/in/stephane-lawnicki",
  slides: [],
  legal: {
    capital: "SYLK Conseils SAS au capital de 1000 Euros — RCS Lyon 879 235 521 — SIRET 879 235 521 00017 — NAF 6619B — ORIAS n°1900 8912",
    rcs: "SYCLEA Finances EI — RCS Lyon 819 550 591 — SIRET 819 550 591 00021 — NAF 6622Z — ORIAS n°12500 6331",
    siret: undefined,
    naf: undefined,
    orias:
      "Courtier et Conseiller en investissements financiers enregistré auprès de la CNCEF, association agréée auprès de l'AMF",
    carteTpi:
      "Agent Immobilier — Carte Transaction sur Immeubles n° CPI69 012020 000 045246 enregistrée auprès de la CCI de Lyon",
    rcp:
      "Responsabilité civile professionnelle et garantie financière souscrites auprès de MMA IARD n°112 788 909",
    phone: "06.16.84.95.61",
  },
};

export default config;
