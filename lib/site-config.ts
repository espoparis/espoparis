export const siteConfig = {
  name: "Espo Paris Academy",
  shortName: "Espo Paris",
  description:
    "A fresh Supabase-first academy platform for public learning, teaching, and administration.",
  brand: {
    wordmarkSrc: "/logo.png",
    wordmarkDarkSrc: "/logo-dark.png",
    markSrc: "/logo.png",
    markDarkSrc: "/logo-dark.png",
    alt: "Espo Paris Academy",
  },
} as const;

export type SiteConfig = typeof siteConfig;
