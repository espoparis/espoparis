export type VerificationState = "verified" | "pending";

export type PublicSiteSettings = {
  contactEmail: string;
  phoneArabicFrench: string;
  phonePersianTurkishAzerbaijani: string;
  phoneEnglish: string;
  phoneAfrica: string;
  supportPhone: string;
  publicAddress: string | null;
  visitingHours: string | null;
  legalPublicName: string | null;
};

export const currentPublicSiteSettings: PublicSiteSettings = {
  contactEmail: "contact@espoparis.com",
  phoneArabicFrench: "+33 7 81 10 39 15",
  phonePersianTurkishAzerbaijani: "+98 902 976 3802",
  phoneEnglish: "+44 7828 604011",
  phoneAfrica: "+234 802 469 2242",
  supportPhone: "+44 7828 604011",
  publicAddress: null,
  visitingHours: null,
  legalPublicName: null,
};

export type SiteSettingsIssue = {
  field: keyof PublicSiteSettings;
  code: "required" | "invalid-email" | "unverified-public-field";
};

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validatePublicSiteSettings(settings: PublicSiteSettings): SiteSettingsIssue[] {
  const issues: SiteSettingsIssue[] = [];
  if (!settings.contactEmail.trim()) issues.push({ field: "contactEmail", code: "required" });
  else if (!looksLikeEmail(settings.contactEmail)) issues.push({ field: "contactEmail", code: "invalid-email" });

  for (const field of ["phoneArabicFrench", "phonePersianTurkishAzerbaijani", "phoneEnglish", "phoneAfrica", "supportPhone"] as const) {
    if (!settings[field].trim()) issues.push({ field, code: "required" });
  }
  return issues;
}

export function getUnverifiedPublicFields(settings: PublicSiteSettings): Array<keyof PublicSiteSettings> {
  const fields: Array<keyof PublicSiteSettings> = [];
  if (!settings.publicAddress) fields.push("publicAddress");
  if (!settings.visitingHours) fields.push("visitingHours");
  if (!settings.legalPublicName) fields.push("legalPublicName");
  return fields;
}
