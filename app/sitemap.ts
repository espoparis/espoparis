import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { publicNavLinks, localizePath } from "@/lib/constants/app";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const publicPaths = [...publicNavLinks.map((link) => link.href), "/support"] as const;

  return routing.locales.flatMap((locale) =>
    publicPaths.map((path) => {

      return {
        url: new URL(localizePath(locale, path), siteConfig.url).toString(),
        lastModified,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alternateLocale) => [
              alternateLocale,
              new URL(localizePath(alternateLocale, path), siteConfig.url).toString(),
            ]),
          ),
        },
      };
    }),
  );
}
