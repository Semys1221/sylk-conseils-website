import { Calendar } from "lucide-react";
import tenantConfig from "@/tenant.config";

const CALENDLY_URL = tenantConfig.calendlyUrl;

export function CalModal() {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-all text-sm font-medium"
    >
      <Calendar size={16} />
      Réserver le prochain rendez-vous
    </a>
  );
}
