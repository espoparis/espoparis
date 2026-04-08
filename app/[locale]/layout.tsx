import type React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppShell } from "@/components/layout/app-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { localeDirection } from "@/lib/constants/app";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AppShell>
        <div
          dir={localeDirection[locale] ?? "ltr"}
          className="flex min-h-screen flex-col"
        >
          <SiteHeader locale={locale} />
          <main data-site-main className="flex flex-1 flex-col pt-24 md:pt-28">{children}</main>
          <SiteFooter locale={locale} />
        </div>
      </AppShell>
    </NextIntlClientProvider>
  );
}
