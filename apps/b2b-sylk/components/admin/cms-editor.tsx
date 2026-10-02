"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { getAdminSession } from "@workspace/tenant-ui";
import { ArrowLeft, Loader2, Rocket, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CmsPageId,
  ExpertisesPageContent,
  HomeMediaContent,
  HomePageContent,
  LeCabinetPageContent,
  SiteContent,
} from "@/lib/cms/schema";

type EditorTab = CmsPageId | "media" | "deploy";

const VERCEL_PROJECT_LABEL =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_LABEL ?? "sylk-conseils/sylk_conseils_website";

const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "home", label: "Accueil" },
  { id: "media", label: "Médias" },
  { id: "leCabinet", label: "Le cabinet" },
  { id: "expertises", label: "Expertises" },
  { id: "tunnel", label: "Calendly" },
  { id: "deploy", label: "Déploiement" },
];

const MEDIA_FIELDS: {
  key: keyof HomeMediaContent;
  label: string;
  slug: string;
  accept: string;
  hint: string;
}[] = [
  {
    key: "heroPortraitUrl",
    label: "Portrait hero (page d'accueil)",
    slug: "hero-portrait",
    accept: "image/*",
    hint: "Colonne gauche du hero sur /",
  },
  {
    key: "expertiseBannerImageUrl",
    label: "Image bannière expertises",
    slug: "expertise-banner",
    accept: "image/*",
    hint: "Grande image de la section « stratégie » sur /",
  },
  {
    key: "funnelVideoUrl",
    label: "Vidéo principale du tunnel",
    slug: "funnel-video",
    accept: "video/mp4,video/webm,video/quicktime",
    hint: "Vidéo verticale à l'ouverture du tunnel",
  },
  {
    key: "funnelVideoPosterUrl",
    label: "Affiche / miniature vidéo",
    slug: "funnel-poster",
    accept: "image/*",
    hint: "Affichée pendant le chargement de la vidéo",
  },
  {
    key: "funnelLogoUrl",
    label: "Logo dans le tunnel",
    slug: "funnel-logo",
    accept: "image/*",
    hint: "Coin supérieur du tunnel de qualification",
  },
];

function TextArea({
  id,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

function FieldInput({
  label,
  id,
  value,
  onChange,
  multiline,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {multiline ? (
        <TextArea id={id} value={value} onChange={onChange} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function CmsEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState<EditorTab>("home");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployPhase, setDeployPhase] = useState<string | null>(null);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      if (!res.ok) throw new Error("Chargement impossible");
      const data = (await res.json()) as { content: SiteContent };
      setContent(data.content);
    } catch {
      toast.error("Impossible de charger le contenu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const savePage = async (pageId: CmsPageId) => {
    const session = getAdminSession();
    if (!session?.email) {
      toast.error("Session admin requise — reconnectez-vous");
      return;
    }
    if (!content) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.email,
          password: pin,
          page: pageId,
          content: content[pageId],
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        content?: SiteContent[CmsPageId];
      };
      if (!res.ok) {
        toast.error(payload.error ?? "Enregistrement échoué");
        return;
      }
      if (payload.content) {
        setContent((prev) => (prev ? { ...prev, [pageId]: payload.content! } : prev));
      }
      toast.success("Contenu enregistré");
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const patchHome = (patch: Partial<HomePageContent>) => {
    setContent((prev) =>
      prev ? { ...prev, home: { ...prev.home, ...patch } } : prev,
    );
  };

  const patchLeCabinet = (patch: Partial<LeCabinetPageContent>) => {
    setContent((prev) =>
      prev ? { ...prev, leCabinet: { ...prev.leCabinet, ...patch } } : prev,
    );
  };

  const patchExpertises = (patch: Partial<ExpertisesPageContent>) => {
    setContent((prev) =>
      prev ? { ...prev, expertises: { ...prev.expertises, ...patch } } : prev,
    );
  };

  const patchMedia = (patch: Partial<HomeMediaContent>) => {
    setContent((prev) =>
      prev
        ? {
            ...prev,
            home: { ...prev.home, media: { ...prev.home.media, ...patch } },
          }
        : prev,
    );
  };

  const uploadMediaFile = async (slug: string, file: File, field: keyof HomeMediaContent) => {
    const session = getAdminSession();
    if (!session?.email) {
      toast.error("Session admin requise — reconnectez-vous");
      return;
    }
    if (!pin) {
      toast.error("Saisissez le PIN admin avant d'uploader");
      return;
    }

    setUploadingField(field);
    try {
      const form = new FormData();
      form.append("email", session.email);
      form.append("password", pin);
      form.append("slug", slug);
      form.append("file", file);

      const res = await fetch("/api/admin/cms/upload", { method: "POST", body: form });
      const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) {
        toast.error(payload.error ?? "Upload échoué");
        return;
      }
      if (payload.url) {
        patchMedia({ [field]: payload.url });
        toast.success("Fichier uploadé — enregistrez l'accueil pour publier");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setUploadingField(null);
    }
  };

  const phaseLabel = (phase: string) => {
    switch (phase) {
      case "queued":
        return "En file d'attente…";
      case "building":
        return "Build en cours…";
      case "ready":
        return "Déploiement prêt";
      case "error":
        return "Erreur de déploiement";
      default:
        return "Statut inconnu";
    }
  };

  const pollDeployment = useCallback(
    async (id: string, sessionEmail: string) => {
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const res = await fetch(`/api/admin/deploy?deploymentId=${encodeURIComponent(id)}`, {
          headers: {
            "x-admin-email": sessionEmail,
            "x-admin-pin": pin,
          },
        });
        if (!res.ok) break;
        const data = (await res.json()) as { phase?: string; url?: string; error?: string };
        if (data.phase) {
          setDeployPhase(data.phase);
          if (data.url) setDeployUrl(data.url);
        }
        if (data.phase === "ready") {
          toast.success("Production mise à jour");
          return;
        }
        if (data.phase === "error") {
          setDeployError(data.error ?? "Le déploiement a échoué");
          toast.error("Déploiement en erreur");
          return;
        }
      }
    },
    [pin],
  );

  const triggerDeploy = async () => {
    const session = getAdminSession();
    if (!session?.email) {
      toast.error("Session admin requise — reconnectez-vous");
      return;
    }
    if (!pin) {
      toast.error("Saisissez le PIN admin");
      return;
    }

    setDeploying(true);
    setDeployError(null);
    setDeployPhase("queued");
    setDeployUrl(null);
    setDeploymentId(null);

    try {
      const res = await fetch("/api/admin/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.email, password: pin }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        phase?: string;
        url?: string;
        deploymentId?: string;
        pollingAvailable?: boolean;
      };
      if (!res.ok) {
        setDeployError(payload.error ?? "Déploiement impossible");
        setDeployPhase("error");
        toast.error(payload.error ?? "Déploiement impossible");
        return;
      }

      setDeployPhase(payload.phase ?? "queued");
      if (payload.url) setDeployUrl(payload.url);
      if (payload.deploymentId) setDeploymentId(payload.deploymentId);
      toast.success("Déploiement lancé sur Vercel");

      if (payload.pollingAvailable && payload.deploymentId) {
        void pollDeployment(payload.deploymentId, session.email);
      }
    } catch {
      setDeployError("Erreur réseau");
      setDeployPhase("error");
      toast.error("Erreur réseau");
    } finally {
      setDeploying(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="dark min-h-dvh bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const home = content.home;
  const leCabinet = content.leCabinet;
  const expertises = content.expertises;
  const tunnel = content.tunnel;
  const media = home.media;

  return (
    <div className="dark min-h-dvh bg-slate-950 text-slate-50">
      <Toaster richColors />
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2"
            >
              <ArrowLeft className="size-4" />
              Retour au tableau de bord
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Contenu du site</h1>
            <p className="text-sm text-slate-400 mt-1">
              Modifiez les textes publics. Les valeurs par défaut restent en place si le CMS est vide.
            </p>
          </div>
        </div>

        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Code PIN admin</CardTitle>
            <CardDescription>
              Saisissez le même PIN que pour la connexion avant d&apos;enregistrer (variable{" "}
              <code className="text-xs">ADMIN_PIN</code>).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              autoComplete="current-password"
            />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)}>
          <TabsList className="w-full flex flex-wrap h-auto gap-1">
            {EDITOR_TABS.map(({ id, label }) => (
              <TabsTrigger key={id} value={id} className="flex-1 min-w-[88px] text-xs sm:text-sm">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="home" className="space-y-6 mt-6">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Hero</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <FieldInput label="Libellé photo" id="h-imageLabel" value={home.hero.imageLabel} onChange={(v) => patchHome({ hero: { ...home.hero, imageLabel: v } })} />
                  <FieldInput label="Ligne fondateur" id="h-founder" value={home.hero.founderLine} onChange={(v) => patchHome({ hero: { ...home.hero, founderLine: v } })} />
                  <FieldInput label="Badge LinkedIn" id="h-badge" value={home.hero.linkedinBadge} onChange={(v) => patchHome({ hero: { ...home.hero, linkedinBadge: v } })} />
                  <FieldInput label="Titre (ligne 1)" id="h-t1" value={home.hero.titleLine1} onChange={(v) => patchHome({ hero: { ...home.hero, titleLine1: v } })} />
                  <FieldInput label="Titre (ligne 2, italique)" id="h-t2" value={home.hero.titleLine2} onChange={(v) => patchHome({ hero: { ...home.hero, titleLine2: v } })} />
                  <FieldInput label="Sous-titre" id="h-sub" multiline value={home.hero.subtitle} onChange={(v) => patchHome({ hero: { ...home.hero, subtitle: v } })} />
                  <FieldInput label="Bouton vidéo" id="h-cta1" value={home.hero.ctaVideo} onChange={(v) => patchHome({ hero: { ...home.hero, ctaVideo: v } })} />
                  <FieldInput label="Bouton LinkedIn" id="h-cta2" value={home.hero.ctaLinkedin} onChange={(v) => patchHome({ hero: { ...home.hero, ctaLinkedin: v } })} />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Section cabinet</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <FieldInput label="Label" id="c-label" value={home.cabinetSection.label} onChange={(v) => patchHome({ cabinetSection: { ...home.cabinetSection, label: v } })} />
                  <FieldInput label="Titre" id="c-title" value={home.cabinetSection.title} onChange={(v) => patchHome({ cabinetSection: { ...home.cabinetSection, title: v } })} />
                  <FieldInput label="Paragraphe 1" id="c-p1" multiline value={home.cabinetSection.paragraph1} onChange={(v) => patchHome({ cabinetSection: { ...home.cabinetSection, paragraph1: v } })} />
                  <FieldInput label="Paragraphe 2" id="c-p2" multiline value={home.cabinetSection.paragraph2} onChange={(v) => patchHome({ cabinetSection: { ...home.cabinetSection, paragraph2: v } })} />
                  <FieldInput label="Bouton" id="c-cta" value={home.cabinetSection.cta} onChange={(v) => patchHome({ cabinetSection: { ...home.cabinetSection, cta: v } })} />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Chiffres clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {home.stats.map((stat, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel>Valeur {i + 1}</FieldLabel>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const stats = [...home.stats];
                          stats[i] = { ...stats[i], value: e.target.value };
                          patchHome({ stats });
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Libellé {i + 1}</FieldLabel>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const stats = [...home.stats];
                          stats[i] = { ...stats[i], label: e.target.value };
                          patchHome({ stats });
                        }}
                      />
                    </Field>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Bannière expertises</CardTitle>
                <CardDescription>Utilisez un retour à la ligne dans le titre pour forcer un saut.</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <FieldInput label="Titre" id="e-title" multiline value={home.expertiseBanner.title} onChange={(v) => patchHome({ expertiseBanner: { ...home.expertiseBanner, title: v } })} />
                  <FieldInput label="Description" id="e-desc" multiline value={home.expertiseBanner.description} onChange={(v) => patchHome({ expertiseBanner: { ...home.expertiseBanner, description: v } })} />
                  <FieldInput label="Bouton" id="e-cta" value={home.expertiseBanner.cta} onChange={(v) => patchHome({ expertiseBanner: { ...home.expertiseBanner, cta: v } })} />
                </FieldGroup>
              </CardContent>
            </Card>

            <Button onClick={() => savePage("home")} disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer l&apos;accueil
            </Button>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 mt-6">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Médias — page d&apos;accueil &amp; tunnel</CardTitle>
                <CardDescription>
                  URL directe ou upload vers Vercel Blob. Laissez vide pour conserver les assets par défaut.
                  Enregistrez l&apos;accueil après modification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {MEDIA_FIELDS.map((field) => (
                  <div key={field.key} className="space-y-2 border-b border-slate-800 pb-6 last:border-0">
                    <Field>
                      <FieldLabel htmlFor={`media-${field.key}`}>{field.label}</FieldLabel>
                      <p className="text-xs text-slate-500 mb-2">{field.hint}</p>
                      <Input
                        id={`media-${field.key}`}
                        value={media[field.key]}
                        onChange={(e) => patchMedia({ [field.key]: e.target.value })}
                        placeholder="https://…"
                      />
                    </Field>
                    <div className="flex items-center gap-2">
                      <input
                        id={`upload-${field.key}`}
                        type="file"
                        accept={field.accept}
                        className="sr-only"
                        disabled={uploadingField === field.key}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void uploadMediaFile(field.slug, file, field.key);
                          e.target.value = "";
                        }}
                      />
                      <Label htmlFor={`upload-${field.key}`} className="cursor-pointer">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={uploadingField === field.key}
                          onClick={() => document.getElementById(`upload-${field.key}`)?.click()}
                        >
                          {uploadingField === field.key ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Upload className="size-4" />
                          )}
                          Téléverser un fichier
                        </Button>
                      </Label>
                      {media[field.key] ? (
                        <a
                          href={media[field.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline truncate max-w-[50%]"
                        >
                          Aperçu
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button onClick={() => savePage("home")} disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer les médias (accueil)
            </Button>
          </TabsContent>

          <TabsContent value="tunnel" className="space-y-6 mt-6">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Lien Calendly du tunnel</CardTitle>
                <CardDescription>
                  Priorité : valeur CMS → variable{" "}
                  <code className="text-xs">NEXT_PUBLIC_CALENDLY_URL</code> → défaut du site.
                  Laissez vide pour utiliser l&apos;environnement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldInput
                  label="URL Calendly"
                  id="tunnel-calendly"
                  value={tunnel.calendlyUrl}
                  onChange={(v) =>
                    setContent((prev) =>
                      prev ? { ...prev, tunnel: { calendlyUrl: v } } : prev,
                    )
                  }
                />
              </CardContent>
            </Card>
            <Button onClick={() => savePage("tunnel")} disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer le tunnel
            </Button>
          </TabsContent>

          <TabsContent value="deploy" className="space-y-6 mt-6">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base">Déployer sur Vercel</CardTitle>
                <CardDescription>
                  Projet{" "}
                  <strong className="font-medium text-slate-300">{VERCEL_PROJECT_LABEL}</strong>{" "}
                  (compte Vercel SYLK Conseils) — déclenchement côté serveur (aucun secret dans le
                  navigateur).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">
                  Avec Git connecté : <code className="text-xs">VERCEL_DEPLOY_HOOK_URL</code> (Deploy Hooks).
                  Sans Git : <code className="text-xs">VERCEL_TOKEN</code> redéploie le dernier build déjà
                  sur Vercel (ne publie pas le code local). Pour un nouveau build :{" "}
                  <code className="text-xs">vercel deploy --prod --scope sylk-conseils</code> avec le token
                  SYLK. Le token sert aussi au suivi du statut ici.
                </p>
                {deployPhase ? (
                  <div
                    className={`rounded-md border px-4 py-3 text-sm ${
                      deployPhase === "ready"
                        ? "border-emerald-800 bg-emerald-950/40 text-emerald-200"
                        : deployPhase === "error"
                          ? "border-red-800 bg-red-950/40 text-red-200"
                          : "border-slate-700 bg-slate-900/60 text-slate-300"
                    }`}
                  >
                    <p className="font-medium">{phaseLabel(deployPhase)}</p>
                    {deploymentId ? (
                      <p className="text-xs mt-1 opacity-80">ID : {deploymentId}</p>
                    ) : null}
                    {deployUrl ? (
                      <a
                        href={deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs mt-2 inline-block text-blue-400 hover:underline"
                      >
                        Ouvrir le déploiement
                      </a>
                    ) : null}
                    {deployError ? <p className="text-xs mt-2">{deployError}</p> : null}
                  </div>
                ) : null}
                <Button
                  type="button"
                  onClick={() => void triggerDeploy()}
                  disabled={deploying}
                  className="w-full"
                >
                  {deploying ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Rocket className="size-4" />
                  )}
                  Déployer sur Vercel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leCabinet" className="space-y-6 mt-6">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardContent className="pt-6">
                <FieldGroup>
                  <FieldInput label="Titre hero" id="lc-title" value={leCabinet.hero.title} onChange={(v) => patchLeCabinet({ hero: { ...leCabinet.hero, title: v } })} />
                  <FieldInput label="Sous-titre hero" id="lc-sub" multiline value={leCabinet.hero.subtitle} onChange={(v) => patchLeCabinet({ hero: { ...leCabinet.hero, subtitle: v } })} />
                  <FieldInput label="Introduction" id="lc-intro" multiline value={leCabinet.intro} onChange={(v) => patchLeCabinet({ intro: v })} />
                  <FieldInput label="Titre approche" id="lc-at" value={leCabinet.approach.title} onChange={(v) => patchLeCabinet({ approach: { ...leCabinet.approach, title: v } })} />
                  <FieldInput label="Approche §1" id="lc-ap1" multiline value={leCabinet.approach.paragraph1} onChange={(v) => patchLeCabinet({ approach: { ...leCabinet.approach, paragraph1: v } })} />
                  <FieldInput label="Approche §2" id="lc-ap2" multiline value={leCabinet.approach.paragraph2} onChange={(v) => patchLeCabinet({ approach: { ...leCabinet.approach, paragraph2: v } })} />
                  <FieldInput label="Titre domaines" id="lc-dt" value={leCabinet.domains.title} onChange={(v) => patchLeCabinet({ domains: { ...leCabinet.domains, title: v } })} />
                  <FieldInput label="Paragraphe domaines" id="lc-dp" multiline value={leCabinet.domains.paragraph} onChange={(v) => patchLeCabinet({ domains: { ...leCabinet.domains, paragraph: v } })} />
                  <FieldInput label="Phrase de clôture" id="lc-close" value={leCabinet.closingLine} onChange={(v) => patchLeCabinet({ closingLine: v })} />
                </FieldGroup>
              </CardContent>
            </Card>
            <Button onClick={() => savePage("leCabinet")} disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer Le cabinet
            </Button>
          </TabsContent>

          <TabsContent value="expertises" className="space-y-6 mt-6">
            <Card className="bg-slate-900/40 border-slate-800">
              <CardContent className="pt-6">
                <FieldGroup>
                  <FieldInput label="Titre hero" id="ex-title" value={expertises.hero.title} onChange={(v) => patchExpertises({ hero: { ...expertises.hero, title: v } })} />
                  <FieldInput label="Sous-titre hero" id="ex-sub" multiline value={expertises.hero.subtitle} onChange={(v) => patchExpertises({ hero: { ...expertises.hero, subtitle: v } })} />
                  <FieldInput label="Libellé bouton cartes" id="ex-cta" value={expertises.cardCta} onChange={(v) => patchExpertises({ cardCta: v })} />
                </FieldGroup>
              </CardContent>
            </Card>
            {expertises.cards.map((card, i) => (
              <Card key={card.slug} className="bg-slate-900/40 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base capitalize">{card.slug}</CardTitle>
                  <CardDescription>Lien : /expertises/{card.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <Label>Titre</Label>
                      <Input
                        value={card.title}
                        onChange={(e) => {
                          const cards = [...expertises.cards];
                          cards[i] = { ...cards[i], title: e.target.value };
                          patchExpertises({ cards });
                        }}
                      />
                    </Field>
                    <Field>
                      <Label>Description</Label>
                      <TextArea
                        id={`ex-card-${i}`}
                        value={card.description}
                        onChange={(v) => {
                          const cards = [...expertises.cards];
                          cards[i] = { ...cards[i], description: v };
                          patchExpertises({ cards });
                        }}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            ))}
            <Button onClick={() => savePage("expertises")} disabled={saving} className="w-full">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Enregistrer Expertises
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
