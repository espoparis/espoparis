import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StudentPortalShell } from "@/features/student/components/student-portal-shell";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthSession } from "@/server/auth/session";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "studentPortal" });
  return buildPageMetadata({ locale: params.locale, path: "/student", title: t("title"), description: t("description") });
}

export default async function StudentPortalPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "studentPortal" });
  const session = await getAuthSession();

  return <StudentPortalShell copy={t.raw("copy")} session={session} locale={params.locale} />;
}
