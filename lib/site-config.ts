export const siteConfig = {
  name: "Espo Paris Academy",
  shortName: "Espo Paris",
  url: "https://www.espoparis.com",
  description:
    "A clear academy home for learning, teaching, and thoughtful growth.",
  category: "education",
  keywords: [
    "Espo Paris Academy",
    "Paris academy",
    "creative learning",
    "education in Paris",
    "academy contact",
    "academy about page",
  ],
  brand: {
    wordmarkSrc: "/logo.png",
    wordmarkDarkSrc: "/logo-dark.png",
    markSrc: "/logo.png",
    markDarkSrc: "/logo-dark.png",
    alt: "Espo Paris Academy",
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
  seo: {
    ogImageAlt: "Espo Paris Academy preview image",
    localeMap: {
      en: "en_US",
      fr: "fr_FR",
      ar: "ar_AR",
      fa: "fa_IR",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
