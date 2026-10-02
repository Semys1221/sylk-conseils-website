"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { KeyRound, Mail, Calendar, DollarSign, Smartphone } from "lucide-react";

const ENCOURS_KEY = "sylk-encours-actuel";
const APP_SETUP_KEY = "sylk-app-setup";

function getEncours(): string {
  if (typeof window === "undefined") return "4 000 000";
  return localStorage.getItem(ENCOURS_KEY) ?? "4 000 000";
}

function setEncours(value: string) {
  localStorage.setItem(ENCOURS_KEY, value);
  window.dispatchEvent(new Event("storage"));
}

interface AppSetup {
  appleId: string;
  legalName: string;
  accountType: "individuel" | "entreprise";
  duns: string;
  taxId: string;
  iban: string;
  accountCreated: boolean;
  bundleId: string;
  appName: string;
  sku: string;
  storeCreated: boolean;
  certStatus: "none" | "generated" | "uploaded";
  provisionStatus: "none" | "generated" | "uploaded";
  version: string;
  buildNumber: string;
  testflightStatus: "none" | "submitted" | "review" | "approved";
  storeStatus: "none" | "submitted" | "review" | "published";
}

function defaultAppSetup(): AppSetup {
  return {
    appleId: "",
    legalName: "",
    accountType: "individuel",
    duns: "",
    taxId: "",
    iban: "",
    accountCreated: false,
    bundleId: "com.sylkconseils.app",
    appName: "SYLK Conseils",
    sku: "SYLK001",
    storeCreated: false,
    certStatus: "none",
    provisionStatus: "none",
    version: "1.0.0",
    buildNumber: "1",
    testflightStatus: "none",
    storeStatus: "none",
  };
}

function getAppSetup(): AppSetup {
  if (typeof window === "undefined") return defaultAppSetup();
  try {
    const raw = localStorage.getItem(APP_SETUP_KEY);
    return raw ? { ...defaultAppSetup(), ...JSON.parse(raw) } : defaultAppSetup();
  } catch {
    return defaultAppSetup();
  }
}

function saveAppSetup(data: AppSetup) {
  localStorage.setItem(APP_SETUP_KEY, JSON.stringify(data));
}

type SetupStep = "account" | "connect" | "certs" | "build";

const SETUP_STEPS: { id: SetupStep; label: string }[] = [
  { id: "account", label: "Compte Développeur" },
  { id: "connect", label: "App Store Connect" },
  { id: "certs", label: "Certificats" },
  { id: "build", label: "Build & Publication" },
];

function statusBadge(label: string, status: string) {
  const map: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; text: string }
  > = {
    none: { variant: "outline", text: "À faire" },
    generated: { variant: "secondary", text: "Généré" },
    uploaded: { variant: "default", text: "Uploadé" },
    submitted: { variant: "secondary", text: "Soumis" },
    review: { variant: "secondary", text: "En review" },
    approved: { variant: "default", text: "Approuvé" },
    published: { variant: "default", text: "Publié" },
  };
  const m = map[status] ?? { variant: "outline", text: status };
  return <Badge variant={m.variant}>{m.text}</Badge>;
}

function AppSetupView() {
  const [data, setData] = useState<AppSetup>(defaultAppSetup);
  const [step, setStep] = useState<SetupStep>("account");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(getAppSetup());
    setLoaded(true);
  }, []);

  const update = (partial: Partial<AppSetup>) => {
    const next = { ...data, ...partial };
    setData(next);
    saveAppSetup(next);
  };

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex justify-center w-fit mx-auto">
          <ButtonGroup>
            {SETUP_STEPS.map((s) => (
              <Button
                key={s.id}
                variant={step === s.id ? "default" : "outline"}
                onClick={() => setStep(s.id)}
              >
                {s.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      {/* Étape 1 — Compte Développeur */}
      {step === "account" && (
        <Card>
          <CardHeader>
            <CardTitle>Compte Développeur Apple</CardTitle>
            <CardDescription>
              Informations à récupérer auprès du client pour créer son compte développeur Apple (99
              €/an).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Apple ID (email du client)</Label>
                <Input
                  value={data.appleId}
                  onChange={(e) => update({ appleId: e.target.value })}
                  placeholder="client@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Nom légal / Société</Label>
                <Input
                  value={data.legalName}
                  onChange={(e) => update({ legalName: e.target.value })}
                  placeholder="Nom ou raison sociale"
                />
              </div>
              <div className="space-y-2">
                <Label>Type de compte</Label>
                <select
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={data.accountType}
                  onChange={(e) =>
                    update({ accountType: e.target.value as "individuel" | "entreprise" })
                  }
                >
                  <option value="individuel">Individuel</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>
              {data.accountType === "entreprise" && (
                <div className="space-y-2">
                  <Label>Numéro D-U-N-S</Label>
                  <Input
                    value={data.duns}
                    onChange={(e) => update({ duns: e.target.value })}
                    placeholder="XX-XXX-XXXX"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Tax ID / TVA</Label>
                <Input
                  value={data.taxId}
                  onChange={(e) => update({ taxId: e.target.value })}
                  placeholder="FRXX XXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label>IBAN (compte bancaire)</Label>
                <Input
                  value={data.iban}
                  onChange={(e) => update({ iban: e.target.value })}
                  placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="account-created"
                checked={data.accountCreated}
                onChange={(e) => update({ accountCreated: e.target.checked })}
                className="size-4 rounded border-slate-600"
              />
              <Label htmlFor="account-created" className="text-sm font-normal">
                Compte développeur créé chez Apple
              </Label>
              {statusBadge("account", data.accountCreated ? "uploaded" : "none")}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2 — App Store Connect */}
      {step === "connect" && (
        <Card>
          <CardHeader>
            <CardTitle>App Store Connect</CardTitle>
            <CardDescription>Configurez l'application dans App Store Connect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bundle ID</Label>
                <Input
                  value={data.bundleId}
                  onChange={(e) => update({ bundleId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nom de l'app</Label>
                <Input value={data.appName} onChange={(e) => update({ appName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={data.sku} onChange={(e) => update({ sku: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="store-created"
                checked={data.storeCreated}
                onChange={(e) => update({ storeCreated: e.target.checked })}
                className="size-4 rounded border-slate-600"
              />
              <Label htmlFor="store-created" className="text-sm font-normal">
                App créée dans App Store Connect
              </Label>
              {statusBadge("store", data.storeCreated ? "uploaded" : "none")}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3 — Certificats */}
      {step === "certs" && (
        <Card>
          <CardHeader>
            <CardTitle>Certificats & Profils</CardTitle>
            <CardDescription>
              Générez les certificats et profils de provisionnement depuis le{" "}
              <a
                href="https://developer.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Apple Developer Portal
              </a>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Certificat de distribution</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Généré depuis Certificates, Identifiers &amp; Profiles
                </p>
              </div>
              <select
                className="flex h-9 w-36 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={data.certStatus}
                onChange={(e) => update({ certStatus: e.target.value as AppSetup["certStatus"] })}
              >
                <option value="none">À faire</option>
                <option value="generated">Généré</option>
                <option value="uploaded">Uploadé</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Profil de provisionnement</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Associé au certificat de distribution
                </p>
              </div>
              <select
                className="flex h-9 w-36 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={data.provisionStatus}
                onChange={(e) =>
                  update({ provisionStatus: e.target.value as AppSetup["provisionStatus"] })
                }
              >
                <option value="none">À faire</option>
                <option value="generated">Généré</option>
                <option value="uploaded">Uploadé</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 4 — Build & Publication */}
      {step === "build" && (
        <Card>
          <CardHeader>
            <CardTitle>Build &amp; Publication</CardTitle>
            <CardDescription>
              Suivi des versions et du statut de publication sur l'App Store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Version</Label>
                <Input value={data.version} onChange={(e) => update({ version: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Numéro de build</Label>
                <Input
                  value={data.buildNumber}
                  onChange={(e) => update({ buildNumber: e.target.value })}
                />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">TestFlight</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Build soumise au test externe
                </p>
              </div>
              <select
                className="flex h-9 w-36 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={data.testflightStatus}
                onChange={(e) =>
                  update({ testflightStatus: e.target.value as AppSetup["testflightStatus"] })
                }
              >
                <option value="none">Non soumis</option>
                <option value="submitted">Soumis</option>
                <option value="review">En review</option>
                <option value="approved">Approuvé</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">App Store</p>
                <p className="text-xs text-muted-foreground mt-0.5">Publication sur l'App Store</p>
              </div>
              <select
                className="flex h-9 w-36 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={data.storeStatus}
                onChange={(e) => update({ storeStatus: e.target.value as AppSetup["storeStatus"] })}
              >
                <option value="none">Pas encore</option>
                <option value="submitted">Soumise</option>
                <option value="review">En review</option>
                <option value="published">Publiée</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Parametres() {
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [encoursInput, setEncoursInput] = useState(getEncours);
  const [tab, setTab] = useState("settings");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "");
        setCreatedAt(user.created_at ?? "");
      }
      setLoading(false);
    })();
  }, []);

  const handlePasswordUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      setUpdating(true);
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setUpdating(false);
      if (error) toast.error(error.message);
      else {
        toast.success("Mot de passe mis à jour");
        setNewPassword("");
        setConfirmPassword("");
      }
    },
    [newPassword, confirmPassword]
  );

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto space-y-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="settings" className="flex-1">
              Réglages
            </TabsTrigger>
            <TabsTrigger value="appsetup" className="flex-1">
              <Smartphone className="size-3.5 mr-1.5" />
              App Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6 space-y-8">
            {/* Email & date */}
            <div className="space-y-4">
              <h2 className="heading-4 font-serif">Informations du compte</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Email :</span>
                  <span className="font-medium truncate">{loading ? "..." : email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Inscrit depuis :</span>
                  <span className="font-medium">
                    {loading
                      ? "..."
                      : createdAt
                        ? new Date(createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Encours actuel */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <DollarSign className="size-4" />
                Encours actuel
              </h3>
              <div className="flex items-center gap-3">
                <Input
                  value={encoursInput}
                  onChange={(e) => {
                    setEncoursInput(e.target.value);
                    setEncours(e.target.value);
                  }}
                  className="font-mono text-sm max-w-[200px]"
                />
                <span className="text-sm text-muted-foreground">€</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Montant affiché sur la carte &quot;Encours actuel&quot; du tableau de bord.
              </p>
            </div>

            <Separator />

            {/* Change password */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <KeyRound className="size-4" />
                Modifier le mot de passe
              </h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={updating}>
                  {updating ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </form>
            </div>

          </TabsContent>

          <TabsContent value="appsetup" className="mt-6">
            <AppSetupView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
