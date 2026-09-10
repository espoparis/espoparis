import type React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { AppShell } from "@/components/layout/app-shell";
import { JsonLd } from "@/components/shared/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { localeDirection } from "@/lib/constants/app";
import { bodyFont } from "@/lib/fonts";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: Props) {
  const params = await props.params;

  const {
    children
  } = props;

  const { locale } = params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Required for these routes to render statically rather than per request.
  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = localeDirection[locale] ?? "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={bodyFont.variable}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <JsonLd data={[createOrganizationJsonLd(), createWebsiteJsonLd()]} />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AppShell>
              <div className="flex min-h-screen flex-col">
                <SiteHeader locale={locale} />
                <main data-site-main className="flex flex-1 flex-col pt-24 md:pt-28">
                  {children}
                </main>
                <SiteFooter locale={locale} />
              </div>
            </AppShell>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
