import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteSettingsCenter } from "@/features/admin/components/site-settings-center";
import { buildPageMetadata } from "@/lib/seo";
import { currentPublicSiteSettings, getUnverifiedPublicFields } from "@/server/admin/site-settings";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "adminSettings" });
  return buildPageMetadata({ locale: params.locale, path: "/admin/settings", title: t("title"), description: t("description") });
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "adminSettings" });
  return <SiteSettingsCenter copy={t.raw("copy")} settings={currentPublicSiteSettings} pendingFields={getUnverifiedPublicFields(currentPublicSiteSettings)} />;
}
