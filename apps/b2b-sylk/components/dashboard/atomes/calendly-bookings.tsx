"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Invitee {
  uuid: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  tracking: Record<string, string>;
  questions_and_answers: { question: string; answer: string }[];
}

interface CalEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: { type: string; location: string } | null;
  invitees: Invitee[];
}

interface BookingsData {
  upcoming: CalEvent[];
  past: CalEvent[];
}

interface ApiResponse {
  error: string | null;
  data: BookingsData | null;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          Confirmé
        </Badge>
      );
    case "canceled":
      return <Badge variant="destructive">Annulé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function EventCard({ event }: { event: CalEvent }) {
  const mainInvitee = event.invitees?.[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm">{event.name}</CardTitle>
            <CardDescription className="mt-0.5">
              {formatDateTime(event.start_time)} &middot; {event.event_type}
            </CardDescription>
          </div>
          {statusBadge(event.status)}
        </div>
      </CardHeader>
      <CardContent>
        {mainInvitee ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="h-3.5 w-3.5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">{mainInvitee.name}</span>
              <span className="text-muted-foreground">({mainInvitee.email})</span>
            </div>
            {event.location?.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>{event.location.location}</span>
              </div>
            )}
            {mainInvitee.questions_and_answers.length > 0 && (
              <div className="mt-2 space-y-1 rounded-lg bg-muted p-2">
                {mainInvitee.questions_and_answers.map((qa, i) => (
                  <p key={i} className="text-xs">
                    <span className="font-medium">{qa.question}:</span> {qa.answer}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun participant</p>
        )}
      </CardContent>
    </Card>
  );
}

export function CalendlyBookings() {
  const [data, setData] = useState<BookingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calendly/bookings");
      const json: ApiResponse = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }
      setData(json.data);
    } catch {
      setError("Failed to load Calendly bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-destructive">{error}</CardContent>
      </Card>
    );
  }

  const upcoming = data?.upcoming ?? [];
  const past = data?.past ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Calendly — Rendez-vous</h2>
          <p className="text-sm text-muted-foreground">
            Prochains rendez-vous et activité de la semaine
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <svg
            className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground">À venir</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {upcoming.filter((e) => e.status === "active").length}
            </p>
            <p className="text-xs text-muted-foreground">Confirmés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{past.length}</p>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Prochains rendez-vous</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event.uri} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Passés (7 jours)</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event.uri} event={event} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucun rendez-vous trouvé.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
