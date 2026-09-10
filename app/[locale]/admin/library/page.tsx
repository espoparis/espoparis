import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DigitalPlatformWorkspace } from "@/features/admin/components/digital-platform-workspace";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthSession } from "@/server/auth/session";
import { getDigitalAdminSnapshot } from "@/server/digital/repository";
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "adminLibrary" });return buildPageMetadata({ locale: params.locale, path: "/admin/library", title: t("title"), description: t("description") });
}
export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const [t, authoring, session] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "adminLibrary" }),
    getTranslations({ locale: params.locale, namespace: "digitalAuthoring" }),
    getAuthSession(),
  ]);
  const snapshot = session.identity ? await getDigitalAdminSnapshot(session.identity) : { state: "not-configured" as const, books: [], lessons: [] };
  return <DigitalPlatformWorkspace copy={t.raw("copy")} authoring={authoring.raw("copy")} snapshot={snapshot} mode="library" locale={params.locale} role={session.identity?.role ?? "visitor"} />;
}
