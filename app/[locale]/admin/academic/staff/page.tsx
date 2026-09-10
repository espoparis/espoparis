import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StaffAccessCenter, type StaffAccessCopy } from "@/features/admin/components/staff-access-center";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthSession } from "@/server/auth/session";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "staffAccess" });
  return buildPageMetadata({ locale: params.locale, path: "/admin/academic/staff", title: t("title"), description: t("description") });
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "staffAccess" });
  const session = await getAuthSession();
  return <StaffAccessCenter copy={t.raw("copy") as StaffAccessCopy} session={session} />;
}
