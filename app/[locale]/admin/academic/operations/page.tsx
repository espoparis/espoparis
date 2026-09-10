import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademicOperationsConsole } from "@/features/admin/components/academic-operations-console";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthSession } from "@/server/auth/session";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "academicOperations" });
  return buildPageMetadata({ locale: params.locale, path: "/admin/academic/operations", title: t("title"), description: t("description") });
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "academicOperations" });
  const session = await getAuthSession();
  return <AcademicOperationsConsole copy={t.raw("copy")} session={session} />;
}
