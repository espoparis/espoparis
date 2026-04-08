import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock3, GraduationCap, LibraryBig, Sparkles } from "lucide-react";
import { SectionBlock } from "@/components/layout/section-block";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { StudentEnrollmentCard } from "@/features/enrollments/components/student-enrollment-card";
import { StudentEnrollmentSummaryStrip } from "@/features/enrollments/components/student-enrollment-summary-strip";
import { getStudentDashboardData } from "@/server/services/dashboard";
import { listStudentEnrollments } from "@/server/repositories/enrollments";
import { requireApprovedRole } from "@/server/auth/session";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { SetupAlert } from "@/components/shared/setup-alert";
import { Badge } from "@/components/ui/badge";

export default async function StudentPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard.student" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "student");
  const [stats, enrollments] = await Promise.all([
    getStudentDashboardData(profile.id),
    listStudentEnrollments(profile.id),
  ]);
  const activeEnrollments = enrollments.filter((item) => item.status === "approved");
  const mostRecentActive = activeEnrollments[0];
  const pendingEnrollments = enrollments.filter((item) => item.status === "pending");

  return (
    <div className="space-y-6">
      <WorkspaceHero
        title={t("title")}
        description={t("description")}
        badges={
          <>
            <Badge variant="secondary">{t("badge")}</Badge>
            <Badge variant="outline">{activeEnrollments.length} {t("active")}</Badge>
            <Badge variant="outline">{pendingEnrollments.length} {t("pending")}</Badge>
          </>
        }
        actions={
          <>
            <Button asChild variant="hero">
            <Link href="/student/courses" locale={params.locale}>
              <Sparkles className="h-4 w-4" />
              {t("quick.coursesLabel")}
            </Link>
          </Button>
            <Button asChild variant="nav" className="border border-border/60 bg-background/82">
            <Link href="/courses" locale={params.locale}>
              {tCommon("browseCatalog")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={t("stats.applications")} value={stats.totalApplications} icon={<Clock3 className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.activeCourses")} value={stats.activeCourses} icon={<LibraryBig className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.pending")} value={stats.pendingApplications} icon={<GraduationCap className="h-5 w-5 text-primary" />} />
      </div>

      {enrollments.length ? <StudentEnrollmentSummaryStrip enrollments={enrollments} /> : null}

      {mostRecentActive ? (
        <Card tone="strong">
          <CardHeader>
            <CardTitle>{t("recentCourseTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-foreground">{mostRecentActive.courseTitle}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {t("recentCourseDescription")}
              </p>
            </div>
            <Button asChild variant="hero">
              <Link href={`/courses/${mostRecentActive.courseId}`} locale={params.locale}>
                <ArrowRight className="h-4 w-4" />
                {tCommon("resumeCourse")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {enrollments.length ? (
        <SectionBlock
          title={t("recentApplicationsTitle")}
          description={t("recentApplicationsDescription")}
          actions={
            <Button asChild variant="nav" className="border border-border/60 bg-background/82">
              <Link href="/student/applications" locale={params.locale}>
                {tCommon("viewAllApplications")}
              </Link>
            </Button>
          }
          contentClassName="grid gap-6 lg:grid-cols-2"
        >
            {enrollments.slice(0, 4).map((enrollment) => (
              <StudentEnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                locale={params.locale}
                mode={enrollment.status === "approved" ? "active" : "application"}
              />
            ))}
        </SectionBlock>
      ) : (
        <EmptyState
          icon={GraduationCap}
          badge={t("badge")}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={{
            label: tCommon("browseCatalog"),
            href: "/courses",
            locale: params.locale,
            variant: "outline",
          }}
        />
      )}

      <QuickActionsPanel
        locale={params.locale}
        items={[
          {
            href: "/courses",
            label: t("quick.catalogLabel"),
            description: t("quick.catalogDescription"),
          },
          {
            href: "/student/courses",
            label: t("quick.coursesLabel"),
            description: t("quick.coursesDescription"),
          },
          {
            href: "/student/applications",
            label: t("quick.applicationsLabel"),
            description: t("quick.applicationsDescription"),
          },
        ]}
      />
    </div>
  );
}
