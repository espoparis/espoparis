import { Amiri, Fraunces, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

export const bodyFont = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const displayFont = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-editorial",
  display: "swap",
});

export const arabicBodyFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-body",
  display: "swap",
});

export const arabicDisplayFont = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-editorial",
  display: "swap",
});
