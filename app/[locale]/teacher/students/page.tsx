import { getTranslations } from "next-intl/server";
import { BookOpenCheck, Users, UserRoundCheck } from "lucide-react";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireApprovedRole } from "@/server/auth/session";
import { listTeacherEnrollments } from "@/server/repositories/enrollments";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { coercePage, paginateItems } from "@/lib/pagination";
import { MetricPanel } from "@/features/dashboard/components/metric-panel";
import { TeacherStudentRosterCard } from "@/features/enrollments/components/teacher-student-roster-card";
import { teacherRosterFilterSchema } from "@/lib/validation/operations";

export default async function TeacherStudentsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.teacherStudents" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const filters = teacherRosterFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    scope: Array.isArray(searchParams?.scope) ? searchParams?.scope[0] : searchParams?.scope,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });

  const { profile } = await requireApprovedRole(params.locale, "teacher");
  const enrollments = await listTeacherEnrollments(profile.id);
  const approved = enrollments.filter((item) => item.status === "approved");
  const roster = Array.from(
    approved.reduce((map, item) => {
      const current = map.get(item.studentId) ?? {
        studentId: item.studentId,
        studentName: item.studentName,
        approvedCourseCount: 0,
        activeCourses: [] as Array<{ courseId: string; courseTitle: string }>,
      };

      current.approvedCourseCount += 1;
      current.activeCourses.push({
        courseId: item.courseId,
        courseTitle: item.courseTitle,
      });

      map.set(item.studentId, current);
      return map;
    }, new Map<string, {
      studentId: string;
      studentName: string;
      approvedCourseCount: number;
      activeCourses: Array<{ courseId: string; courseTitle: string }>;
    }>())
  ).map(([, student]) => student);

  const normalizedQuery = filters.q.toLowerCase();
  const filteredRoster = roster
    .filter((student) => {
      const matchesScope =
        filters.scope === "single"
          ? student.approvedCourseCount === 1
          : filters.scope === "multi"
            ? student.approvedCourseCount > 1
            : true;

      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : student.studentName.toLowerCase().includes(normalizedQuery) ||
            student.activeCourses.some((course) =>
              course.courseTitle.toLowerCase().includes(normalizedQuery)
            );

      return matchesScope && matchesQuery;
    })
    .sort((left, right) => {
      if (filters.sort === "student-asc") {
        return left.studentName.localeCompare(right.studentName);
      }

      if (filters.sort === "student-desc") {
        return right.studentName.localeCompare(left.studentName);
      }

      return right.approvedCourseCount - left.approvedCourseCount;
    });
  const page = coercePage(searchParams?.page);
  const paginatedRoster = paginateItems(filteredRoster, page, 6);

  const multiCourseStudents = roster.filter((student) => student.approvedCourseCount > 1).length;

  return roster.length ? (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("badge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: t("approvedLearnersLabel"),
            value: roster.length,
            description: t("approvedLearnersDescription"),
            icon: Users,
            tone: "accent" as const,
          },
          {
            label: t("approvedSeatsLabel"),
            value: approved.length,
            description: t("approvedSeatsDescription"),
            icon: BookOpenCheck,
            tone: "strong" as const,
          },
          {
            label: t("multiCourseLabel"),
            value: multiCourseStudents,
            description: t("multiCourseDescription"),
            icon: UserRoundCheck,
            tone: "soft" as const,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <MetricPanel
              key={item.label}
              label={item.label}
              value={item.value}
              description={item.description}
              icon={<Icon className="h-4 w-4" />}
              tone={item.tone}
            />
          );
        })}
      </div>

      <OperationsFilters
        locale={params.locale}
        title={t("filtersTitle")}
        description={t("filtersDescription")}
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        query={filters.q}
        resultsCount={filteredRoster.length}
        resultsSummary={t("summary", {
          count: filteredRoster.length,
          total: roster.length,
          label: t("label"),
        })}
        resetHref="/teacher/students"
        selects={[
          {
            name: "scope",
            label: t("coverage"),
            value: filters.scope,
            options: [
              { value: "all", label: t("allLearners") },
              { value: "single", label: t("singleCourse") },
              { value: "multi", label: t("multiCourse") },
            ] as const,
          },
          {
            name: "sort",
            label: t("sort"),
            value: filters.sort,
            options: [
              { value: "coverage-desc", label: t("mostCoverage") },
              { value: "student-asc", label: t("studentAsc") },
              { value: "student-desc", label: t("studentDesc") },
            ] as const,
          },
        ]}
      />

      <Card tone="strong">
        <CardHeader>
          <CardTitle>{t("rosterTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          {paginatedRoster.items.length ? (
            paginatedRoster.items.map((student) => (
              <TeacherStudentRosterCard
                key={student.studentId}
                student={student}
                locale={params.locale}
              />
            ))
          ) : (
            <div className="lg:col-span-2">
              <EmptyState
                icon={Users}
                badge={t("noMatchesBadge")}
                title={t("noMatchesTitle")}
                description={t("noMatchesDescription")}
                action={{
                  label: tCommon("resetFilters"),
                  href: "/teacher/students",
                  locale: params.locale,
                  variant: "outline",
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ServerPagination
        locale={params.locale}
        pathname="/teacher/students"
        searchParams={searchParams}
        currentPage={paginatedRoster.currentPage}
        totalPages={paginatedRoster.totalPages}
        totalItems={paginatedRoster.totalItems}
        startIndex={paginatedRoster.startIndex}
        endIndex={paginatedRoster.endIndex}
        label={t("label")}
      />
    </div>
  ) : (
    <EmptyState
      icon={Users}
      badge={t("emptyBadge")}
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={{
        label: t("badge"),
        href: "/teacher/enrollments",
        locale: params.locale,
        variant: "outline",
      }}
    />
  );
}
