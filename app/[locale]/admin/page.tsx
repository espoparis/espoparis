import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { buildPageMetadata } from "@/lib/seo";
import { getAdminModules, getAdminRoleLabel } from "@/server/admin/dashboard";
import { getAuthSession } from "@/server/auth/session";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "adminDashboard" });
  return buildPageMetadata({ locale: params.locale, path: "/admin", title: t("title"), description: t("description") });
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "adminDashboard" });
  const session = await getAuthSession();
  const role = session.identity?.role ?? "visitor";

  return (
    <AdminDashboard
      copy={t.raw("copy")}
      locale={params.locale}
      email={session.identity?.email ?? "—"}
      roleLabel={getAdminRoleLabel(role)}
      modules={getAdminModules(session)}
    />
  );
}
