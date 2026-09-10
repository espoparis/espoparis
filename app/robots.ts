import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizePath } from "@/lib/constants/app";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const adminPaths = routing.locales.map((locale) => localizePath(locale, "/admin"));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...adminPaths, "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
