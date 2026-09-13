import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/navigation";
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
    <header className="page-shell py-10"><h1 className="font-display text-4xl">{t("title")}</h1><p className="mt-4 text-muted-foreground">{t("description")}</p><Link href="/admin/help" className="mt-5 inline-block underline">{(await getTranslations({locale:params.locale,namespace:"adminOperations"}))("help")}</Link></header>
    <CmsLiveWorkspace locale={params.locale} session={session} snapshot={snapshot} copy={t.raw("live")} />
  </>;
}
