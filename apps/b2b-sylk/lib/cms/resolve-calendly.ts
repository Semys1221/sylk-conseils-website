const DEFAULT_CALENDLY_URL =
  "https://calendly.com/syli-conseils/optimiser-vos-avantages-en-tant-qu-independant-clone";

/** CMS → env → committed default. */
export function resolveCalendlyUrl(cmsUrl: string | undefined): string {
  const trimmed = cmsUrl?.trim();
  if (trimmed) return trimmed;
  return process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || DEFAULT_CALENDLY_URL;
}
