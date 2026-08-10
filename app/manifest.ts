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
        // The generated `/icon` route is a true 512x512 square. `logo.png` is a
        // 327x109 wordmark and was being declared at the wrong size here.
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
