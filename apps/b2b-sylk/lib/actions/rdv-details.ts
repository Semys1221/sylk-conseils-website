"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface RdvDetail {
  id: string;
  calendly_event_uuid: string;
  created_at: string;
  updated_at: string;
  identity_name: string;
  identity_function: string;
  identity_organization: string;
  identity_location: string;
  identity_email: string;
  identity_phone: string;
  identity_contact_point: string;
  engagement_interest_level: string;
  engagement_acquisition_process: string;
  engagement_additional_info: string;
  session_title: string;
  session_expectations: string;
  session_conversion_argument: string;
}

export async function getRdvDetail(calendlyEventUuid: string) {
  const { data, error } = await supabaseAdmin
    .from("rdv_details")
    .select("*")
    .eq("calendly_event_uuid", calendlyEventUuid)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data as RdvDetail | null;
}
