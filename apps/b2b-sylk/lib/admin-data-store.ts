import { create } from "zustand";

export interface ApiActivityItem {
  id: string;
  type: "visit" | "lead" | "rdv";
  title: string;
  subtitle: string;
  timestamp: string;
}

export interface DataPoint {
  date: string;
  pageviews: number;
  sessions: number;
}

export interface CampaignStats {
  total_sent?: number;
  total_opened?: number;
  total_clicked?: number;
  total_replied?: number;
  total_bounced?: number;
}

export interface Campaign {
  id: number;
  name: string;
  status: string;
  total_leads: number;
  analytics?: CampaignStats;
}

export interface Invitee {
  uuid: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  tracking: Record<string, string>;
  questions_and_answers: { question: string; answer: string }[];
}

export interface CalEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: { type: string; location: string } | null;
  invitees: Invitee[];
}

export interface BookingsData {
  upcoming: CalEvent[];
  past: CalEvent[];
}

interface AdminDataStore {
  activity: ApiActivityItem[];
  analytics: DataPoint[];
  campaigns: Campaign[];
  calendly: BookingsData | null;

  loading: boolean;
  lastFetched: number | null;
  error: string | null;
  calendlyError: string | null;

  fetchAll: () => Promise<void>;
}

export const useAdminDataStore = create<AdminDataStore>((set) => ({
  activity: [],
  analytics: [],
  campaigns: [],
  calendly: null,

  loading: false,
  lastFetched: null,
  error: null,
  calendlyError: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [activityRes, analyticsRes, smartleadRes, calendlyRes] = await Promise.allSettled([
        fetch("/api/admin/activity"),
        fetch("/api/analytics"),
        fetch("/api/smartlead"),
        fetch("/api/calendly/bookings"),
      ]);

      let activity: ApiActivityItem[] = [];
      if (activityRes.status === "fulfilled") {
        const json = await activityRes.value.json();
        if (json.items) activity = json.items;
      }

      let analytics: DataPoint[] = [];
      if (analyticsRes.status === "fulfilled") {
        const json = await analyticsRes.value.json();
        if (!json.error && json.data?.results) {
          const results = json.data.results as Array<{ days: string[]; data: number[] }>;
          if (results.length >= 2) {
            analytics = results[0].days.map((day: string, i: number) => ({
              date: new Date(day).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
              pageviews: results[0].data[i] ?? 0,
              sessions: results[1]?.data[i] ?? 0,
            }));
          }
        }
      }

      let campaigns: Campaign[] = [];
      if (smartleadRes.status === "fulfilled") {
        const json = await smartleadRes.value.json();
        if (!json.error) campaigns = json.data ?? [];
      }

      let calendly: BookingsData | null = null;
      let calendlyError: string | null = null;
      if (calendlyRes.status === "fulfilled") {
        const json = await calendlyRes.value.json();
        if (json.error) {
          calendlyError = json.error;
        } else if (json.data) {
          calendly = json.data;
        }
      } else {
        calendlyError = "Erreur réseau lors du chargement des rendez-vous";
      }

      set({
        activity,
        analytics,
        campaigns,
        calendly,
        calendlyError,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch {
      set({ loading: false, error: "Erreur lors du chargement des données" });
    }
  },
}));
