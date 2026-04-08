import { getTranslations } from "next-intl/server";
import { ArrowRight, BookOpenCheck, Clock3, Upload, UserRoundCheck } from "lucide-react";
import { SectionBlock } from "@/components/layout/section-block";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { TeacherCourseCard } from "@/features/courses/components/teacher-course-card";
import { TeacherCourseSummaryStrip } from "@/features/courses/components/teacher-course-summary-strip";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { getTeacherDashboardData } from "@/server/services/dashboard";
import { listTeacherCourses } from "@/server/queries/courses";
import { requireApprovedRole } from "@/server/auth/session";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";

export default async function TeacherPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard.teacher" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "teacher");
  const [stats, courses] = await Promise.all([
    getTeacherDashboardData(profile.id),
    listTeacherCourses(profile.id),
  ]);

  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <Button asChild variant="hero">
          <Link href="/teacher/courses/new" locale={params.locale}>
            <Upload className="h-4 w-4" />
            {tCommon("newCourse")}
          </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("stats.courses")} value={stats.totalCourses} icon={<BookOpenCheck className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.published")} value={stats.publishedCourses} icon={<ArrowRight className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.pendingEnrollments")} value={stats.pendingEnrollments} icon={<Clock3 className="h-5 w-5 text-primary" />} />
        <StatCard label={t("stats.approvedStudents")} value={stats.approvedStudents} icon={<UserRoundCheck className="h-5 w-5 text-primary" />} />
      </div>

      {courses.length ? (
        <TeacherCourseSummaryStrip locale={params.locale} courses={courses} />
      ) : null}

      {courses.length ? (
        <SectionBlock
          title={t("recentTitle")}
          description={t("recentDescription")}
          actions={
            <Button asChild variant="nav" className="border border-border/60 bg-background/82">
              <Link href="/teacher/courses" locale={params.locale}>
                {tCommon("viewAllCourses")}
              </Link>
            </Button>
          }
          contentClassName="grid gap-6 lg:grid-cols-2"
        >
            {courses.slice(0, 4).map((course) => (
              <TeacherCourseCard key={course.id} course={course} locale={params.locale} />
            ))}
        </SectionBlock>
      ) : (
        <EmptyState
          icon={BookOpenCheck}
          badge={t("quick.coursesLabel")}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={{
            label: tCommon("newCourse"),
            href: "/teacher/courses/new",
            locale: params.locale,
          }}
        />
      )}

      <QuickActionsPanel
        locale={params.locale}
        items={[
          {
            href: "/teacher/courses",
            label: t("quick.coursesLabel"),
            description: t("quick.coursesDescription"),
          },
          {
            href: "/teacher/enrollments",
            label: t("quick.enrollmentsLabel"),
            description: t("quick.enrollmentsDescription"),
          },
          {
            href: "/teacher/students",
            label: t("quick.studentsLabel"),
            description: t("quick.studentsDescription"),
          },
        ]}
      />
    </div>
  );
}
