import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireApprovedRole } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard.nav" });
  const { profile } = await requireApprovedRole(params.locale, "student");
  const studentLinks = [
    { href: "/student", label: t("overview") },
    { href: "/student/courses", label: t("myCourses") },
    { href: "/student/applications", label: t("applications") },
    { href: "/student/profile", label: t("profile") },
  ];

  return (
    <DashboardShell locale={params.locale} profile={profile} links={studentLinks}>
      {children}
    </DashboardShell>
  );
}
