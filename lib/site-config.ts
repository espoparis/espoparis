export const siteConfig = {
  name: "Espo Paris Academy",
  shortName: "Espo Paris",
  description:
    "A clear academy home for learning, teaching, and thoughtful growth.",
  brand: {
    wordmarkSrc: "/logo.png",
    wordmarkDarkSrc: "/logo-dark.png",
    markSrc: "/logo.png",
    markDarkSrc: "/logo-dark.png",
    alt: "Espo Paris Academy",
  },
  contact: {
    primaryEmail: "hello@espoparis.academy",
    admissionsEmail: "admissions@espoparis.academy",
    partnershipsEmail: "partnerships@espoparis.academy",
    phone: "+33 1 84 80 24 10",
    addressLineOne: "24 Rue de la Paix",
    addressLineTwo: "75002 Paris, France",
    visitHoursWeekdays: "Monday to Friday, 9:00 to 18:00",
    visitHoursSaturday: "Saturday visits by appointment",
  },
} as const;

export type SiteConfig = typeof siteConfig;
