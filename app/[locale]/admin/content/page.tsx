import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContentManagementCenter } from "@/features/admin/components/content-management-center";
import { CmsLiveWorkspace } from "@/features/admin/components/cms-live-workspace";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthSession } from "@/server/auth/session";
import { getCmsAdminSnapshot } from "@/server/content/cms-repository";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "adminContent" });
  return buildPageMetadata({ locale: params.locale, path: "/admin/content", title: t("title"), description: t("description") });
}
export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "adminContent" });
  const session = await getAuthSession();
  const snapshot = session.identity ? await getCmsAdminSnapshot(session.identity) : { state: "not-configured" as const, items: [], reflections: [] };
  return <>
    <ContentManagementCenter copy={t.raw("copy")} session={session} />
    <CmsLiveWorkspace locale={params.locale} session={session} snapshot={snapshot} copy={t.raw("live")} />
  </>;
}
