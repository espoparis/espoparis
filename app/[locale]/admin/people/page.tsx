import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PeoplePermissionsCenter } from "@/features/admin/components/people-permissions-center";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "adminPeople" });
  return buildPageMetadata({ locale: params.locale, path: "/admin/people", title: t("title"), description: t("description") });
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "adminPeople" });
  return <PeoplePermissionsCenter copy={t.raw("copy")} />;
}
