import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { localizePath } from "@/lib/constants/app";
import { siteConfig } from "@/lib/site-config";

type PageMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function getLocalizedUrl(locale: string, path: string) {
  return absoluteUrl(localizePath(locale, path));
}

export function getLanguageAlternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocalizedUrl(locale, path)]),
  ) as Record<string, string>;

  languages["x-default"] = absoluteUrl(path);
  return languages;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = getLocalizedUrl(locale, path);
  const titleValue = absoluteTitle ? { absolute: title } : title;

  return {
    title: titleValue,
    description,
    alternates: {
      canonical: url,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.seo.localeMap[locale as keyof typeof siteConfig.seo.localeMap] ?? "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createOrganizationJsonLd() {
  const address =
    siteConfig.contact.addressLineOne && siteConfig.contact.addressLineTwo
      ? {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.addressLineOne,
          addressLocality: "Paris",
          addressCountry: "FR",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.brand.wordmarkSrc),
    description: siteConfig.description,
    email: siteConfig.contact.primaryEmail,
    ...(address ? { address } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contact.primaryEmail,
        availableLanguage: [
          "English",
          "French",
          "Arabic",
          "Persian",
          "Turkish",
          "Azerbaijani",
        ],
      },
      {
        "@type": "ContactPoint",
        contactType: "admissions",
        email: siteConfig.contact.admissionsEmail,
        availableLanguage: [
          "English",
          "French",
          "Arabic",
          "Persian",
          "Turkish",
          "Azerbaijani",
        ],
      },
      {
        "@type": "ContactPoint",
        contactType: "partnerships",
        email: siteConfig.contact.partnershipsEmail,
        availableLanguage: ["English", "French", "Arabic", "Persian"],
      },
    ],
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: routing.locales,
  };
}

export function createWebPageJsonLd({
  locale,
  path,
  title,
  description,
  type = "WebPage",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: getLocalizedUrl(locale, path),
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
