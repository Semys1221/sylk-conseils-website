"use client";

import { useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useAdminDataStore, type Campaign } from "@/lib/admin-data-store";

interface NicheRow {
  slug: string;
  label: string;
  campaign: Campaign | null;
}

const NICHES: { slug: string; label: string }[] = [
  { slug: "expert-comptable", label: "Experts-comptables" },
  { slug: "notaire", label: "Notaires" },
  { slug: "avocat-fiscaliste", label: "Avocats fiscalistes" },
  { slug: "architecte-liberal", label: "Architectes libéraux" },
  { slug: "consultant", label: "Consultant" },
  { slug: "kinesitherapeute-liberal", label: "Kinésithérapeutes libéraux" },
  { slug: "medecin-liberal", label: "Médecins libéraux" },
  { slug: "dentiste-liberal", label: "Dentistes libéraux" },
  { slug: "agent-immobilier", label: "Agents immobiliers" },
  { slug: "commercial-independant", label: "Commerciaux indépendants" },
];

const CAMPAIGN_TO_NICHE: [string, string][] = [
  ["Auto: paramedical", "kinesitherapeute-liberal"],
  ["Auto: creatif", "architecte-liberal"],
  ["Auto: conseil", "consultant"],
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-500",
  PAUSED: "bg-yellow-500",
  DRAFTED: "bg-neutral-400",
  STOPPED: "bg-red-500",
};

type Tab = "niches" | "communication" | "engagement";

function matchCampaign(campaigns: Campaign[], slug: string): Campaign | null {
  for (const [prefix, mappedSlug] of CAMPAIGN_TO_NICHE) {
    if (mappedSlug !== slug) continue;
    const found = campaigns.find((c) => c.name.includes(prefix));
    if (found) return found;
  }
  return null;
}

function pct(value: number | undefined, total: number | undefined): string {
  if (!total || total <= 0 || value == null) return "-";
  return ((value / total) * 100).toFixed(1) + "%";
}

// ─── Niches Tab ───────────────────────────────────────────────

function NichesTab({ rows }: { rows: NicheRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Top 10 niches</CardTitle>
        <CardDescription>Liste des 10 niches ciblées et leur statut de campagne.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Niche</TableHead>
              <TableHead className="text-center">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.slug}>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="text-center">
                  {r.campaign ? (
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span
                        className={`size-2 rounded-full ${STATUS_STYLES[r.campaign.status] ?? "bg-neutral-300"}`}
                      />
                      {r.campaign.status}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Communication Tab ────────────────────────────────────────

const commChartConfig = {
  sent: { label: "Volume envoyé", color: "var(--chart-1)" },
} satisfies ChartConfig;

function CommunicationTab({ rows }: { rows: NicheRow[] }) {
  const data = rows.map((r) => ({
    niche: r.label,
    sent: r.campaign?.analytics?.total_sent ?? 0,
  }));

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="font-serif">Communication</CardTitle>
        <CardDescription>
          Volume d&apos;e-mails envoyés par niche. Reflète l&apos;intensité de votre prospection
          sortante.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={commChartConfig} className="mx-auto aspect-square max-h-[350px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="niche" tick={{ fontSize: 10 }} />
            <PolarGrid />
            <Radar
              dataKey="sent"
              fill="var(--color-sent)"
              fillOpacity={0.6}
              stroke="var(--color-sent)"
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Engagement Tab ───────────────────────────────────────────

const engChartConfig = {
  openRate: { label: "Taux d'ouverture", color: "var(--chart-1)" },
  replyRate: { label: "Taux de réponse", color: "var(--chart-2)" },
} satisfies ChartConfig;

function EngagementTab({ rows }: { rows: NicheRow[] }) {
  const data = rows.map((r) => {
    const s = r.campaign?.analytics;
    const sent = s?.total_sent ?? 0;
    return {
      niche: r.label,
      openRate: sent > 0 ? Math.round(((s?.total_opened ?? 0) / sent) * 100) : 0,
      replyRate: sent > 0 ? Math.round(((s?.total_replied ?? 0) / sent) * 100) : 0,
    };
  });

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="font-serif">Engagement</CardTitle>
        <CardDescription>
          Taux d&apos;ouverture et de réponse par niche. Un taux d&apos;ouverture élevé indique un
          sujet pertinent ; un taux de réponse élevé traduit un vrai intérêt.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={engChartConfig} className="mx-auto aspect-square max-h-[350px]">
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="niche" tick={{ fontSize: 10 }} />
            <PolarGrid />
            <Radar
              dataKey="openRate"
              fill="var(--color-openRate)"
              fillOpacity={0.6}
              stroke="var(--color-openRate)"
            />
            <Radar
              dataKey="replyRate"
              fill="var(--color-replyRate)"
              fillOpacity={0.6}
              stroke="var(--color-replyRate)"
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────

export default function Pipeline() {
  const { campaigns, loading, error, fetchAll } = useAdminDataStore();
  const [tab, setTab] = useState<Tab>("niches");

  const nicheRows: NicheRow[] = NICHES.map((n) => ({
    ...n,
    campaign: matchCampaign(campaigns, n.slug),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 overflow-x-auto">
        <ButtonGroup className="shrink-0">
          {(["niches", "communication", "engagement"] as Tab[]).map((t) => (
            <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>
              {t === "niches" ? "Niches" : t === "communication" ? "Communication" : "Engagement"}
            </Button>
          ))}
        </ButtonGroup>
        <Button variant="outline" size="sm" onClick={() => fetchAll()} disabled={loading}>
          <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {!error && loading && campaigns.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 px-4">
              <div className="h-3 bg-slate-800 rounded animate-pulse w-1/4" />
              <div className="h-3 bg-slate-800/60 rounded animate-pulse w-16 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {!error && !loading && campaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="size-5 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">Aucune campagne active</p>
            <p className="text-xs text-slate-500 max-w-xs">
              Créez vos campagnes dans SmartLead pour voir les données ici.
            </p>
          </CardContent>
        </Card>
      )}

      {!error && campaigns.length > 0 && (
        <>
          {tab === "niches" && <NichesTab rows={nicheRows} />}
          {tab === "communication" && <CommunicationTab rows={nicheRows} />}
          {tab === "engagement" && <EngagementTab rows={nicheRows} />}
        </>
      )}
    </div>
  );
}
