export interface ServiceDefinition {
  id: string;
  name: string;
  category: "api" | "auth" | "storage" | "analytics" | "communication" | "scheduling";
  description: string;
  docsUrl?: string;
  envVars: string[];
  testEndpoint: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: "pusher",
    name: "Pusher",
    category: "communication",
    description: "Synchronisation temps-réel des slides dans la Salle de Vente Interactive.",
    docsUrl: "https://pusher.com/docs",
    envVars: [
      "NEXT_PUBLIC_PUSHER_KEY",
      "NEXT_PUBLIC_PUSHER_APP_ID",
      "PUSHER_SECRET",
      "NEXT_PUBLIC_PUSHER_CLUSTER",
    ],
    testEndpoint: "pusher",
  },
  {
    id: "n8n",
    name: "N8N Webhook",
    category: "api",
    description:
      "Réception des réponses du tunnel de qualification pour déclencher les workflows email/CRM.",
    docsUrl: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/",
    envVars: ["N8N_WEBHOOK_URL"],
    testEndpoint: "n8n",
  },
  {
    id: "calendly",
    name: "Calendly",
    category: "scheduling",
    description: "Lien de réservation de consultation affiché aux prospects qualifiés.",
    docsUrl: "https://calendly.com/docs",
    envVars: ["NEXT_PUBLIC_CALENDLY_URL"],
    testEndpoint: "calendly",
  },
  {
    id: "daily",
    name: "Daily.co",
    category: "communication",
    description:
      "Interface vidéo intégrée dans la Salle de Vente Interactive. Configuré via tenant.config.ts (dailyRoomUrl).",
    docsUrl: "https://docs.daily.co",
    envVars: [],
    testEndpoint: "daily",
  },
  {
    id: "posthog",
    name: "PostHog",
    category: "analytics",
    description:
      "Tracking des événements utilisateurs et analytics du site (pageviews, sessions, conversions).",
    docsUrl: "https://posthog.com/docs",
    envVars: ["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"],
    testEndpoint: "posthog",
  },
];

export interface EnvVarDefinition {
  key: string;
  description: string;
  isPublic: boolean;
  module: string;
  example: string;
}

export const ENV_VARS: EnvVarDefinition[] = [
  {
    key: "GEMINI_API_KEY",
    description: "Clé API Google Gemini",
    isPublic: false,
    module: "Core",
    example: "AIza...",
  },
  {
    key: "APP_URL",
    description: "URL publique du site",
    isPublic: false,
    module: "Core",
    example: "https://montismedia.com",
  },
  {
    key: "N8N_WEBHOOK_URL",
    description: "URL du webhook N8N central",
    isPublic: false,
    module: "Funnel",
    example: "https://n8n.app/webhook/...",
  },
  {
    key: "NEXT_PUBLIC_CALENDLY_URL",
    description: "Lien Calendly de réservation",
    isPublic: true,
    module: "Funnel",
    example: "https://calendly.com/sylk-conseils/30min",
  },
  {
    key: "NEXT_PUBLIC_DAILY_ROOM_URL",
    description: "URL de la room Daily.co",
    isPublic: true,
    module: "Salle de Vente",
    example: "https://xxx.daily.co/room",
  },
  {
    key: "NEXT_PUBLIC_PUSHER_KEY",
    description: "Clé publique Pusher",
    isPublic: true,
    module: "Salle de Vente",
    example: "abc123...",
  },
  {
    key: "NEXT_PUBLIC_PUSHER_APP_ID",
    description: "App ID Pusher",
    isPublic: true,
    module: "Salle de Vente",
    example: "1234567",
  },
  {
    key: "PUSHER_SECRET",
    description: "Secret serveur Pusher",
    isPublic: false,
    module: "Salle de Vente",
    example: "secret...",
  },
  {
    key: "NEXT_PUBLIC_PUSHER_CLUSTER",
    description: "Région Pusher (ex: eu)",
    isPublic: true,
    module: "Salle de Vente",
    example: "eu",
  },
  {
    key: "NEXT_PUBLIC_PUSHER_CHANNEL_ID",
    description: "Nom du channel Pusher",
    isPublic: true,
    module: "Salle de Vente",
    example: "montis-media",
  },
  {
    key: "NEXT_PUBLIC_POSTHOG_KEY",
    description: "Clé projet PostHog",
    isPublic: true,
    module: "Analytics",
    example: "phc_...",
  },
  {
    key: "NEXT_PUBLIC_POSTHOG_HOST",
    description: "Host PostHog (EU ou US)",
    isPublic: true,
    module: "Analytics",
    example: "https://eu.posthog.com",
  },
  {
    key: "ADMIN_PIN",
    description: "Code PIN pour /admin",
    isPublic: false,
    module: "Admin",
    example: "4 chiffres minimum",
  },
];
