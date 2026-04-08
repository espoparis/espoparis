import { getTranslations } from "next-intl/server";
import { BookOpen, ShieldCheck, Users } from "lucide-react";
import { SectionBlock } from "@/components/layout/section-block";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { AdminSummaryStrip } from "@/features/admin/components/admin-summary-strip";
import { AdminUserCard } from "@/features/admin/components/admin-user-card";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getAdminDashboardData } from "@/server/services/dashboard";
import { listProfiles } from "@/server/repositories/profiles";
import { requireAdmin } from "@/server/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { SetupAlert } from "@/components/shared/setup-alert";
import { Link } from "@/lib/navigation";

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard.admin" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  await requireAdmin(params.locale);
  const [stats, profiles] = await Promise.all([getAdminDashboardData(), listProfiles()]);
  const pendingProfiles = profiles.filter((profile) => profile.approval_status === "pending");

  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("pendingTitle")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("stats.users")} value={stats.totalUsers} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.pendingApprovals")} value={stats.pendingUsers} icon={<ShieldCheck className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.teachers")} value={stats.totalTeachers} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.courses")} value={stats.totalCourses} icon={<BookOpen className="h-5 w-5 text-primary" />} />
      </div>

      <AdminSummaryStrip
        items={[
          {
            label: t("summary.pendingLabel"),
            value: stats.pendingUsers,
            description: t("summary.pendingDescription"),
            tone: "soft",
          },
          {
            label: t("summary.mixLabel"),
            value: `${stats.totalTeachers}/${stats.totalStudents}`,
            description: t("summary.mixDescription"),
            tone: "strong",
          },
          {
            label: t("summary.catalogLabel"),
            value: `${stats.publishedCourses}/${stats.totalCourses}`,
            description: t("summary.catalogDescription"),
            tone: "accent",
          },
        ]}
        narrative={t("summary.narrative", {
          totalUsers: stats.totalUsers,
          pendingUsers: stats.pendingUsers,
        })}
      />

      {pendingProfiles.length ? (
        <SectionBlock
          title={t("pendingTitle")}
          description={t("pendingDescription")}
          actions={
            <Button asChild variant="nav" className="border border-border/60 bg-background/82">
              <Link href="/admin/users" locale={params.locale}>
                {t("pendingAction")}
              </Link>
            </Button>
          }
          contentClassName="grid gap-6 lg:grid-cols-2"
        >
            {pendingProfiles.slice(0, 4).map((profile) => (
              <AdminUserCard key={profile.id} locale={params.locale} profile={profile} />
            ))}
        </SectionBlock>
      ) : (
        <EmptyState
          icon={Users}
          badge={t("pendingTitle")}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={{
            label: t("pendingAction"),
            href: "/admin/users",
            locale: params.locale,
            variant: "outline",
          }}
        />
      )}

      <QuickActionsPanel
        locale={params.locale}
        items={[
          {
            href: "/admin/users",
            label: t("quick.usersLabel"),
            description: t("quick.usersDescription"),
          },
          {
            href: "/admin/courses",
            label: t("quick.coursesLabel"),
            description: t("quick.coursesDescription"),
          },
          {
            href: "/admin/profile",
            label: t("quick.profileLabel"),
            description: t("quick.profileDescription"),
          },
        ]}
      />
    </div>
  );
}
