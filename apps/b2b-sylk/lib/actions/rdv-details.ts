"use server";

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

export async function getRdvDetail(_calendlyEventUuid: string) {
  return null as RdvDetail | null;
}
