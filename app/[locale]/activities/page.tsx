import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ActivitiesShell } from "@/features/activities/components/activities-shell";
import { buildPageMetadata } from "@/lib/seo";
import { getPublicCmsSnapshot } from "@/server/content/cms-repository";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "activities" });
  return buildPageMetadata({ locale: params.locale, path: "/activities", title: t("title"), description: t("description") });
}
export default async function ActivitiesPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "activities" });
  const cms = await getPublicCmsSnapshot();
  const items = cms.items.filter((item) => item.kind === "news" || item.kind === "activity" || item.kind === "announcement");
  return <ActivitiesShell copy={t.raw("copy")} items={items} />;
}
