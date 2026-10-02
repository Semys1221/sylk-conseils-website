// ─── Lead Status ───

export type LeadStatus =
  | "raw"
  | "cleaned"
  | "ready_to_send"
  | "active_in_sequence"
  | "replied"
  | "warming"
  | "cold"
  | "unsubscribed"
  | "bounced"
  | "funnel_started"
  | "funnel_completed"
  | "qualified"
  | "disqualified"
  | "waiting"
  | "booked"
  | "cancelled"
  | "rescheduled"
  | "confirmed"
  | "no_show"
  | "recovering"
  | "meeting_done"
  | "proposal_sent"
  | "won"
  | "lost"
  | "paid"
  | "onboarding"
  | "onboarding_stuck"
  | "onboarded"
  | "active_client"
  | "blacklist"
  | "archived"
  | "deleted";

export type AllLeadStatus = LeadStatus;

export type LeadSource =
  | "apollo"
  | "linkedin_scrape"
  | "csv_import"
  | "manual"
  | "funnel"
  | "scrape_worker"
  | "google_maps";

// ─── Valid Transitions ───

export const VALID_TRANSITIONS: Record<string, string[]> = {
  raw: ["cleaned", "blacklist"],
  cleaned: ["ready_to_send", "blacklist"],
  ready_to_send: ["active_in_sequence"],
  active_in_sequence: ["replied", "cold", "unsubscribed", "bounced"],
  replied: ["warming", "disqualified", "waiting"],
  warming: ["qualified", "cold", "disqualified", "waiting", "replied"],
  funnel_started: ["funnel_completed"],
  funnel_completed: ["qualified", "disqualified"],
  qualified: ["booked"],
  booked: ["confirmed", "cancelled", "rescheduled"],
  rescheduled: ["booked"],
  confirmed: ["meeting_done", "no_show"],
  no_show: ["recovering", "booked"],
  recovering: ["booked", "blacklist", "waiting", "disqualified", "proposal_sent"],
  meeting_done: ["proposal_sent", "disqualified", "waiting", "recovering"],
  proposal_sent: ["won", "lost"],
  won: ["paid"],
  paid: ["onboarding"],
  onboarding: ["onboarded", "onboarding_stuck"],
  onboarding_stuck: ["onboarding"],
  onboarded: ["active_client"],
};

export const BRAIN_PRIORITY: Record<BrainType, number> = {
  strategic: 5,
  human: 4,
  sync: 3,
  ai: 2,
  async: 1,
};

// ─── Brain ───

export type BrainType = "sync" | "async" | "ai" | "human" | "strategic";

export interface TransitionInput {
  to_status: AllLeadStatus;
  triggered_by: BrainType;
  metadata?: Record<string, unknown>;
}

export interface TransitionResult {
  id: string;
  status: AllLeadStatus;
  previous_status: AllLeadStatus;
  transition_valid: boolean;
  metadata?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

// ─── Sequences & Campaigns ───

export type SequenceStatus = "draft" | "ready" | "archived";
export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type CampaignTrigger = "n8n_webhook" | "smartlead_api" | "manual";

export interface Sequence {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  status: SequenceStatus;
  tags: string[];
  steps: SequenceStep[];
  created_at: string;
  updated_at: string;
}

export interface SequenceStep {
  id: string;
  sequence_id: string;
  step_order: number;
  day_delay: number;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  tenant_id: string;
  name: string;
  sequence_id?: string;
  trigger_type: CampaignTrigger;
  status: CampaignStatus;
  lead_filter: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ─── Cold Lead ───

export interface ColdLead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  domain?: string;
  linkedin_url?: string;
  phone_number?: string;
  location?: string;
  source: LeadSource;
  status: LeadStatus;
  icebreaker?: string;
  personalized_body?: string;
  stop_sequence: boolean;
  outreach_channel: "smartlead" | "resend";
  last_contacted_at?: string;
  smartlead_lead_id?: number;
  smartlead_campaign_id?: number;
  tenant_id: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

// ─── AI / Email Generation ───

export interface GenerateEmailInput {
  tenantId: string;
  companyName: string;
  industry?: string;
  prospectFirstName: string;
  context?: string;
  tone?: "professional" | "friendly" | "direct";
  stepOrder: number;
  previousSteps?: { subject: string; body: string }[];
}

export interface GenerateEmailOutput {
  subject: string;
  body: string;
}

export interface CleanLeadInput {
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone_number?: string;
}

export interface CleanLeadOutput {
  email_valid: boolean;
  email_corrected?: string;
  first_name_clean?: string;
  last_name_clean?: string;
  company_name_clean?: string;
  domain?: string;
  is_disposable: boolean;
  is_role_based: boolean;
  risk_score: "low" | "medium" | "high";
}

// ─── Appointments & Tasks ───

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type TaskStatus = "todo" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Appointment {
  id: string;
  tenant_id: string;
  prospect_name: string;
  prospect_email?: string;
  prospect_phone?: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  assigned_to?: string;
  related_to?: string;
  related_id?: string;
  created_at: string;
  updated_at: string;
}

// ─── Warm Lead Types ───

export type WarmEmailStatus =
  | "pending"
  | "sent"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "failed";
export type WarmTriggerType =
  | "click"
  | "site_visit"
  | "reply"
  | "simulator_access"
  | "no_action_after_5";

export interface WarmTrigger {
  type: WarmTriggerType;
  data?: {
    replyBody?: string;
    url?: string;
    page?: string;
    simulatorResult?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface WarmEmail {
  id: string;
  lead_id: string;
  tenant_id: string;
  campaign_id?: string;
  step_number: 1 | 2 | 3 | 4 | 5;
  status: WarmEmailStatus;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  reply_body?: string;
  reply_sentiment?: string;
  reply_analyzed: boolean;
  next_email_at?: string;
  triggered_by?: string;
  subject: string;
  body_html: string;
  gmail_message_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WarmEmailTemplate {
  id: string;
  tenant_id: string;
  campaign_id: string;
  step_number: 1 | 2 | 3 | 4 | 5;
  subject: string;
  body_react: string;
  variables_schema: { required: string[]; optional: string[] };
  status: "active" | "draft" | "archived";
  version: number;
  created_by: "gemini" | "human";
  created_at: string;
  updated_at: string;
}

export interface WarmEmailVariables {
  prospect_name: string;
  prospect_first_name: string;
  niche: string;
  offer_summary: string;
  cta_text: string;
  cta_url?: string;
  linkedin_url: string;
  website_url: string;
  simulator_url?: string;
  tenant_logo_url: string;
  tenant_name: string;
  tenant_address: string;
  advisor_name: string;
  advisor_title: string;
  social_proof?: string;
  unsubscribe_url: string;
}

// ─── Recovery Circuit Types ───

export type RecoveryType = "no_show" | "documents" | "silence";
export type RecoveryEmailStatus =
  | "pending"
  | "sent"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "failed";
export type RecoveryTriggerType = "rebooked" | "documents_received" | "reply_negative" | "click";

export interface RecoveryTrigger {
  type: RecoveryTriggerType;
  data?: {
    reason?: string;
    url?: string;
    attachments?: string[];
    bookingUid?: string;
  };
  timestamp: string;
}

export interface RecoveryEmail {
  id: string;
  lead_id: string;
  tenant_id: string;
  recovery_type: RecoveryType;
  step_number: 1 | 2 | 3 | 4 | 5;
  status: RecoveryEmailStatus;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  reply_body?: string;
  next_email_at?: string;
  triggered_by?: string;
  subject: string;
  body_html: string;
  gmail_message_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface RecoveryEmailTemplate {
  id: string;
  tenant_id: string;
  recovery_type: RecoveryType;
  step_number: 1 | 2 | 3 | 4 | 5;
  subject: string;
  body_react: string;
  variables_schema: { required: string[]; optional: string[] };
  status: "active" | "draft" | "archived";
  version: number;
  created_by: "gemini" | "human";
  created_at: string;
  updated_at: string;
}

export interface RecoveryEmailVariables {
  prospect_name: string;
  prospect_first_name: string;
  meeting_recap?: string;
  missing_docs?: string[];
  cta_text: string;
  cta_url?: string;
  tenant_logo_url: string;
  tenant_name: string;
  advisor_name: string;
  advisor_title: string;
  linkedin_url: string;
  website_url: string;
  unsubscribe_url: string;
}

// ─── Variant / Email Framework Types ───

export type VariantKey = "A" | "B" | "C";
export type VariantStatus = "active" | "dropped" | "winning";

export interface CampaignVariant {
  id: string;
  campaign_id: string;
  tenant_id: string;
  variant_key: VariantKey;
  status: VariantStatus;
  subject: string;
  body: string;
  subject_followup?: string;
  body_followup?: string;
  leads_assigned: number;
  leads_sent: number;
  metadata: {
    salutation_type: "bonjour" | "bonjour_a_vous" | "cher_niche";
    angle_type: "primary" | "secondary";
    cta_index: number;
  };
  created_at: string;
  updated_at: string;
}

export interface VariantStats {
  id: string;
  campaign_id: string;
  variant_key: VariantKey;
  tenant_id: string;
  emails_sent: number;
  total_replies: number;
  positive_replies: number;
  reply_rate: number;
  positive_rate: number;
  score: number;
  evaluation?: "winning" | "dropped" | "keep_monitoring";
  evaluated_at: string;
}

export interface NicheOffer {
  id: string;
  tenant_id: string;
  niche: string;
  version: number;
  offer_md: string;
  pain_point: string;
  result: string;
  method: string;
  angle_primary: string;
  angle_secondary?: string;
  social_proof?: string;
  metadata?: Record<string, unknown>;
  created_by: "gemini" | "human";
  superseded_by?: string;
  created_at: string;
}

export interface NicheCTA {
  id: string;
  tenant_id: string;
  niche: string;
  version: number;
  cta_list: string[];
  superseded_by?: string;
  created_by: "gemini" | "human";
  created_at: string;
}

// ─── Webhook Payloads ───

export interface SmartLeadReplyPayload {
  event: "reply_received";
  lead_id: number;
  campaign_id: number;
  from_email: string;
  subject: string;
  body: string;
  replied_at: string;
}

export interface CalComBookingCreatedPayload {
  triggerEvent: "BOOKING_CREATED";
  payload: {
    uid: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: { email: string; name: string }[];
    metadata?: { lead_id?: string };
  };
}

// ─── CRM Activity Types ───

export type CRMActivityType = "interested_prospect" | "website_visit" | "booked_call";

export interface CRMActivity {
  id: string;
  tenant_id: string;
  type: CRMActivityType;
  lead_id?: string;
  prospect_name?: string;
  prospect_email?: string;
  source: string;
  source_id?: string;
  metadata?: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
}

export interface CRMStats {
  interested_count: number;
  website_visit_count: number;
  booked_call_count: number;
  total: number;
}

export interface CRMSyncResult {
  synced: number;
  interested: number;
  website_visits: number;
  booked_calls: number;
  errors?: string[];
  last_sync?: string;
}

// ─── Settings Types ───

export interface DiscoveryQuestion {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "toggle";
  options?: string[];
  required?: boolean;
}

export type ScreeningLevel = "simple" | "medium" | "hard";

export interface CallSettings {
  defaultRecipients: string[];
  discoveryQuestions: DiscoveryQuestion[];
  screeningLevel: ScreeningLevel;
}

export interface WebsiteSettings {
  domain: string;
  orias: string;
  legalMentions: string;
  tone: string;
  color: string;
}

export interface TenantSettings {
  callSettings: CallSettings;
  websiteSettings: WebsiteSettings;
}
