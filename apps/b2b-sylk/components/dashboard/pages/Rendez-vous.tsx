"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAdminDataStore,
  type Invitee,
  type CalEvent,
  type BookingsData,
} from "@/lib/admin-data-store";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  RefreshCw,
  User,
  Video,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  MapPinned,
  Star,
  Target,
  UserCircle2,
  Calendar,
} from "lucide-react";

import type { RdvDetail } from "@/lib/actions/rdv-details";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function EventCard({ event, index = 0 }: { event: CalEvent; index?: number }) {
  const invitee = event.invitees?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06, ease: "easeOut" }}
      whileTap={{ scale: 0.985, y: 1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-sm font-serif">{event.name}</CardTitle>
              <CardDescription>{formatDateTime(event.start_time)}</CardDescription>
            </div>
            <Badge
              variant={event.status === "active" ? "default" : "destructive"}
              className="shrink-0"
            >
              {event.status === "active" ? "Confirmé" : "Annulé"}
            </Badge>
          </div>
        </CardHeader>
        {invitee && (
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-3.5 shrink-0" />
              <span className="font-medium text-foreground">{invitee.name}</span>
              <span>({invitee.email})</span>
            </div>
            {event.location?.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                {event.location.type === "physical" ? (
                  <MapPin className="size-3.5 shrink-0" />
                ) : (
                  <Video className="size-3.5 shrink-0" />
                )}
                <span>{event.location.location}</span>
              </div>
            )}
            {invitee.questions_and_answers.length > 0 && (
              <div className="rounded-lg bg-muted p-2 space-y-1">
                {invitee.questions_and_answers.map((qa, i) => (
                  <p key={i} className="text-xs">
                    <span className="font-medium">{qa.question} :</span> {qa.answer}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function RdvDetailCard({ detail }: { detail: RdvDetail }) {
  return (
    <div className="space-y-6">
      {/* Section I — Identité */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCircle2 className="size-4 text-blue-400" />
            <CardTitle className="text-sm font-serif">Identité</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Nom complet</span>
            <p className="font-medium">{detail.identity_name}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Fonction</span>
            <p className="font-medium">{detail.identity_function}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="size-3" /> Organisation
            </span>
            <p className="font-medium">{detail.identity_organization}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPinned className="size-3" /> Localisation
            </span>
            <p className="font-medium">{detail.identity_location}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="size-3" /> Courriel
            </span>
            <p className="font-medium">{detail.identity_email}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="size-3" /> Téléphone
            </span>
            <p className="font-medium">{detail.identity_phone}</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <span className="text-xs text-muted-foreground">Point de contact initial</span>
            <p className="font-medium">{detail.identity_contact_point}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section II — Engagement */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="size-4 text-amber-400" />
            <CardTitle className="text-sm font-serif">
              Indicateurs d&apos;engagement et qualification
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Niveau d&apos;intérêt</span>
            <p className="font-medium text-emerald-400">{detail.engagement_interest_level}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Processus d&apos;acquisition</span>
            <p className="font-medium">{detail.engagement_acquisition_process}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Information complémentaire</span>
            <p className="font-medium">{detail.engagement_additional_info}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section III — Session */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="size-4 text-violet-400" />
            <CardTitle className="text-sm font-serif">Objet et axe d&apos;entretien</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Intitulé de la session</span>
            <p className="font-medium">{detail.session_title}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Attentes de l&apos;interlocuteur</span>
            <p className="font-medium">{detail.session_expectations}</p>
          </div>
          <div className="rounded-lg bg-violet-500/5 border border-violet-500/10 p-4">
            <span className="text-xs text-muted-foreground block mb-2">
              Argumentaire de conversion cible
            </span>
            <p className="text-sm italic text-violet-300 leading-relaxed">
              &ldquo;{detail.session_conversion_argument}&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RendezVous() {
  const { calendly: data, loading, error, calendlyError, fetchAll } = useAdminDataStore();
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [rdvDetail, setRdvDetail] = useState<RdvDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [tab, setTab] = useState("rdv");

  const upcoming = data?.upcoming ?? [];
  const past = data?.past ?? [];
  const confirmed = upcoming.filter((e) => e.status === "active").length;
  const allBookings = [...upcoming, ...past];

  const handleSelectEvent = async (event: CalEvent) => {
    setSelectedEvent(event);
    setTab("detail");
    setLoadingDetail(true);
    setDetailError(null);
    setRdvDetail(null);
    const uuid = event.uri.split("/").pop();
    if (!uuid) return;
    try {
      const { getRdvDetail } = await import("@/lib/actions/rdv-details");
      const data = await getRdvDetail(uuid);
      setRdvDetail(data);
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="rdv">Rendez-vous</TabsTrigger>
          <TabsTrigger value="salle">Salle de réunion</TabsTrigger>
          <TabsTrigger value="detail">Détail</TabsTrigger>
        </TabsList>

        <TabsContent value="rdv" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-serif">Rendez-vous</CardTitle>
                  <CardDescription>
                    Consultez l&apos;ensemble des rendez-vous pris via votre calendrier.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchAll()} disabled={loading}>
                  <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
              </div>
            </CardHeader>

            {(error || calendlyError) && !data && (
              <CardContent>
                <p className="text-sm text-destructive text-center py-8">
                  {calendlyError || error}
                </p>
              </CardContent>
            )}

            {!error && !calendlyError && loading && !data && (
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="py-6">
                        <div className="animate-pulse space-y-3">
                          <div className="h-8 w-12 bg-muted rounded" />
                          <div className="h-3 w-24 bg-muted rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 mt-8">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="py-5">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-muted rounded w-2/3" />
                          <div className="h-3 bg-muted rounded w-1/3" />
                          <div className="h-3 bg-muted rounded w-1/2 mt-3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            )}

            {!calendlyError && data && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "À venir", value: upcoming.length, color: "" },
                    { label: "Confirmés", value: confirmed, color: "text-green-600" },
                    { label: "Passés (7j)", value: past.length, color: "text-muted-foreground" },
                  ].map(({ label, value, color }) => (
                    <Card key={label}>
                      <CardContent className="py-4 text-center">
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {upcoming.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Prochains rendez-vous
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {upcoming.map((event, i) => (
                        <EventCard key={event.uri} event={event} index={i} />
                      ))}
                    </div>
                  </section>
                )}

                {past.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Passés (7 jours)</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {past.map((event, i) => (
                        <EventCard key={event.uri} event={event} index={i} />
                      ))}
                    </div>
                  </section>
                )}

                {upcoming.length === 0 && past.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                      <Calendar className="size-5 text-amber-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300 mb-1">Aucun rendez-vous</p>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Vos prochains rendez-vous Calendly apparaîtront ici.
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="salle" className="mt-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80"
                alt="Salle de réunion"
                className="w-full h-52 object-cover transition-opacity duration-500 opacity-0"
                onLoad={(e) => (e.target as HTMLImageElement).classList.remove("opacity-0")}
              />
              <div className="absolute inset-0 bg-blue-900/30" />
            </div>
            <CardHeader className="relative">
              <CardTitle className="font-serif">Salle de réunion SYLK</CardTitle>
              <CardDescription>
                Rejoignez votre salle de réunion dédiée pour vos échanges à distance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Retrouvez vos clients et partenaires dans un espace sécurisé. Cliquez ci-dessous
                pour accéder à la salle.
              </p>
              <Button
                className="w-full gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                onClick={() =>
                  window.open("https://reunion.sylkconseils.com", "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink size={16} />
                Rejoindre la salle
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail" className="mt-6">
          {!selectedEvent ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Détail des rendez-vous</CardTitle>
                <CardDescription>
                  Sélectionnez un rendez-vous pour voir ses informations détaillées.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    Aucun rendez-vous à afficher.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBookings.map((event) => {
                        const invitee = event.invitees?.[0];
                        return (
                          <TableRow
                            key={event.uri}
                            className="cursor-pointer hover:bg-blue-500/5 transition-colors"
                            onClick={() => handleSelectEvent(event)}
                          >
                            <TableCell className="text-xs">
                              {formatDateShort(event.start_time)}
                            </TableCell>
                            <TableCell className="font-medium">{invitee?.name || "—"}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {invitee?.email || "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectEvent(event);
                                }}
                              >
                                Voir les détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEvent(null);
                    setRdvDetail(null);
                    setDetailError(null);
                    setTab("rdv");
                  }}
                  className="gap-1.5 text-muted-foreground"
                >
                  <ArrowLeft size={15} />
                  Retour à la liste
                </Button>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(selectedEvent.start_time)}
                </span>
              </div>

              {loadingDetail && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="animate-pulse h-4 bg-slate-800 rounded w-1/3" />
                      </CardHeader>
                      <CardContent>
                        <div className="animate-pulse space-y-3">
                          <div className="h-3 bg-slate-800 rounded w-1/2" />
                          <div className="h-3 bg-slate-800 rounded w-2/3" />
                          <div className="h-3 bg-slate-800 rounded w-1/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {detailError && (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-destructive">
                    {detailError}
                  </CardContent>
                </Card>
              )}

              {rdvDetail && <RdvDetailCard detail={rdvDetail} />}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
