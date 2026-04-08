import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import { bodyFont } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  keywords: [...siteConfig.keywords],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: siteConfig.brand.markSrc, type: "image/png" },
      { url: siteConfig.brand.markDarkSrc, media: "(prefers-color-scheme: dark)", type: "image/png" },
    ],
    shortcut: [siteConfig.brand.markSrc],
    apple: [siteConfig.brand.markSrc],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#10141a" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={bodyFont.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <JsonLd data={[createOrganizationJsonLd(), createWebsiteJsonLd()]} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
