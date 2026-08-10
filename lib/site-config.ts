const PRODUCTION_URL = "https://www.espoparis.com";

/**
 * Canonical origin for metadata, hreflang, sitemap, and JSON-LD.
 *
 * Driven by `NEXT_PUBLIC_SITE_URL` so preview and staging deploys advertise
 * their own origin instead of pointing search engines at production. Falls back
 * to the production origin when the variable is absent.
 */
function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return PRODUCTION_URL;
  }

  try {
    // Normalise away any trailing slash so `new URL(path, url)` stays stable.
    return new URL(configured).origin;
  } catch {
    return PRODUCTION_URL;
  }
}

export const siteConfig = {
  name: "Espo Paris Academy",
  shortName: "Espo Paris",
  alternateName: "Espoparis",
  seminaryName: "Imam (AJ) Center – Paris",
  url: resolveSiteUrl(),
  description:
    "Espo Paris Academy presents Imam Center (AJ) - Paris: a seminary rooted in Paris, preparing students, teachers, and preachers for France, Europe, and the wider Francophone world.",
  category: "education",
  keywords: [
    "Espo Paris Academy",
    "Espoparis",
    "Espo Paris",
    "Imam Center Paris",
    "seminary in Paris",
    "Islamic seminary France",
    "Francophone Islamic studies",
    "weekend school teacher training",
  ],
  brand: {
    wordmarkSrc: "/logo.png",
    wordmarkDarkSrc: "/logo-dark.png",
    markSrc: "/logo.png",
    markDarkSrc: "/logo-dark.png",
    alt: "Espo Paris Academy",
    // Intrinsic pixel sizes of the files in `public/`.
    wordmarkSize: { width: 327, height: 109 },
    wordmarkDarkSize: { width: 866, height: 288 },
  },
  contact: {
    primaryEmail: "hello@espoparis.com",
    admissionsEmail: "admissions@espoparis.com",
    partnershipsEmail: "partnerships@espoparis.com",
    phone: "+33 1 84 80 24 10",
    addressLineOne: "24 Rue de la Paix",
    addressLineTwo: "75002 Paris, France",
    visitHoursWeekdays: "Monday to Friday, 9:00 to 18:00",
    visitHoursSaturday: "Saturday visits by appointment",
  },
  /**
   * Enrolment is handled by a Google Form. `embedUrl` is what the /register
   * page iframes; `viewUrl` is the escape hatch offered alongside it for
   * visitors whose browser or extensions block third-party frames.
   */
  registration: {
    viewUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfBABcSblUchrtpQzrPE70eolB3H0i3VG8G9_1Mb1MflOcfAA/viewform",
    embedUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfBABcSblUchrtpQzrPE70eolB3H0i3VG8G9_1Mb1MflOcfAA/viewform?embedded=true",
  },
  seo: {
    ogImageAlt: "Espo Paris Academy preview image",
    brandQuery: "Espoparis",
    localeMap: {
      en: "en_US",
      fr: "fr_FR",
      ar: "ar_SA",
      fa: "fa_IR",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
