import { routing } from "@/i18n/routing";

export const localeDirection: Record<string, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
  fa: "rtl",
};

export const publicNavLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

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
