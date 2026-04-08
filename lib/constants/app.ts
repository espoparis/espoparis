import { routing } from "@/i18n/routing";
import type { AppRole, ApprovalStatus } from "@/lib/types/database";

export const localeDirection: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
  fa: "rtl",
};

export const publicNavLinks = [
  { href: "/", key: "home" },
  { href: "/courses", key: "courses" },
  { href: "/about", key: "about" },
] as const;

export const approvalLabels: Record<ApprovalStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export function isValidLocale(locale: string) {
  return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

export function localizePath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === routing.defaultLocale) {
    return normalized;
  }

  return `/${locale}${normalized}`;
}
