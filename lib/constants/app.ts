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
  { href: "/register", key: "register" },
  { href: "/contact", key: "contact" },
] as const;

export function isValidLocale(locale: string) {
  return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

/**
 * Matches a nav link against the current locale-stripped pathname. Shared so the
 * desktop and mobile navs cannot drift apart.
 */
export function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === "/") {
    return false;
  }

  return pathname.startsWith(`${href}/`);
}

export function localizePath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === routing.defaultLocale) {
    return normalized;
  }

  return `/${locale}${normalized}`;
}
