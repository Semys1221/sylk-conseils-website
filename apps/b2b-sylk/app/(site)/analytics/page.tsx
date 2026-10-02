import type { Metadata } from "next";
import { AnalyticsClient } from "./client";

export const metadata: Metadata = {
  title: "Analytics | SYLK Conseils",
  description: "Statistiques de fréquentation du site.",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Visiteurs, pages vues et tendances du site.</p>
        </div>
        <AnalyticsClient />
      </div>
    </div>
  );
}
