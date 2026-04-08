import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#10141a",
    theme_color: "#10141a",
    icons: [
      {
        src: siteConfig.brand.markSrc,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
