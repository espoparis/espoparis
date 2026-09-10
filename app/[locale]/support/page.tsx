import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SupportPage } from "@/features/support/components/support-page";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "support" });
  return buildPageMetadata({ locale: params.locale, path: "/support", title: t("title"), description: t("description") });
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "support" });
  return <SupportPage copy={t.raw("copy")} />;
}
