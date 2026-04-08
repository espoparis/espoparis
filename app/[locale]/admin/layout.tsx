import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAdmin } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard.nav" });
  const { profile } = await requireAdmin(params.locale);
  const adminLinks = [
    { href: "/admin", label: t("overview") },
    { href: "/admin/users", label: t("users") },
    { href: "/admin/courses", label: t("courses") },
    { href: "/admin/profile", label: t("profile") },
  ];

  return (
    <DashboardShell locale={params.locale} profile={profile} links={adminLinks}>
      {children}
    </DashboardShell>
  );
}
