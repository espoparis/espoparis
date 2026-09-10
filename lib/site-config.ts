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
    "Espo Paris Academy presents Imam (AJ) Center – Paris: a hawza rooted in Paris, preparing students, teachers, and preachers for France, Europe, and the wider Francophone world.",
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
    wordmarkSrc: "/brand-mark.webp",
    wordmarkDarkSrc: "/brand-mark.webp",
    markSrc: "/brand-mark.webp",
    markDarkSrc: "/brand-mark.webp",
    alt: "École Supérieure de Paris — Imam (AJ) Center, Paris",
    // Intrinsic pixel sizes of the files in `public/`.
    wordmarkSize: { width: 327, height: 109 },
    wordmarkDarkSize: { width: 866, height: 288 },
  },
  contact: {
    // One mailbox serves all three routes for now. They stay as separate
    // fields so a dedicated admissions or partnerships address can be split
    // out later without touching every call site.
    primaryEmail: "contact@espoparis.com",
    admissionsEmail: "contact@espoparis.com",
    partnershipsEmail: "contact@espoparis.com",
    donationsEmail: "contact@espoparis.com",
    phones: {
      arFr: {
        display: "+33 7 81 10 39 15",
        tel: "+33781103915",
        languages: ["Arabic", "French"],
      },
      faTrAz: {
        display: "+98 902 976 3802",
        tel: "+989029763802",
        languages: ["Persian", "Turkish", "Azerbaijani"],
      },
      en: {
        display: "+44 7828 604011",
        tel: "+447828604011",
        languages: ["English"],
      },
      africa: {
        display: "+234 802 469 2242",
        tel: "+2348024692242",
        languages: ["African languages"],
      },
    },
    donationsPhone: {
      display: "+44 7828 604011",
      tel: "+447828604011",
      whatsapp: "447828604011",
    },
    // Public address and visiting hours are intentionally unpublished until
    // the administration confirms the official details. Never guess these.
    addressLineOne: null,
    addressLineTwo: null,
    visitHoursWeekdays: null,
    visitHoursSaturday: null,
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
