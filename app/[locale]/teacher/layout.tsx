import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireApprovedRole } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function TeacherLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard.nav" });
  const { profile } = await requireApprovedRole(params.locale, "teacher");
  const teacherLinks = [
    { href: "/teacher", label: t("overview") },
    { href: "/teacher/courses", label: t("courses") },
    { href: "/teacher/enrollments", label: t("enrollments") },
    { href: "/teacher/students", label: t("students") },
    { href: "/teacher/profile", label: t("profile") },
  ];

  return (
    <DashboardShell locale={params.locale} profile={profile} links={teacherLinks}>
      {children}
    </DashboardShell>
  );
}
