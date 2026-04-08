import { getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentEnrollmentCard } from "@/features/enrollments/components/student-enrollment-card";
import { StudentEnrollmentSummaryStrip } from "@/features/enrollments/components/student-enrollment-summary-strip";
import { requireApprovedRole } from "@/server/auth/session";
import { listStudentEnrollments } from "@/server/repositories/enrollments";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { Link } from "@/lib/navigation";
import { coercePage, paginateItems } from "@/lib/pagination";
import { studentEnrollmentFilterSchema } from "@/lib/validation/operations";

export default async function StudentCoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.studentCourses" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "student");
  const enrollments = await listStudentEnrollments(profile.id);
  const approved = enrollments.filter((item) => item.status === "approved");
  const filters = studentEnrollmentFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });
  const normalizedQuery = filters.q.toLowerCase();
  const filteredApproved = approved
    .filter((enrollment) => {
      const matchesQuery =
        !normalizedQuery ||
        enrollment.courseTitle.toLowerCase().includes(normalizedQuery) ||
        enrollment.teacherName.toLowerCase().includes(normalizedQuery);

      return matchesQuery;
    })
    .sort((left, right) => {
      if (filters.sort === "title-asc") {
        return left.courseTitle.localeCompare(right.courseTitle);
      }

      if (filters.sort === "teacher-asc") {
        return left.teacherName.localeCompare(right.teacherName);
      }

      return 0;
    });
  const page = coercePage(searchParams?.page);
  const paginatedApproved = paginateItems(filteredApproved, page, 6);
  const primaryCourse = filteredApproved[0] ?? approved[0];

  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("badge")}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button asChild variant="hero">
            <Link href="/courses" locale={params.locale}>
              <ArrowRight className="h-4 w-4" />
              {tCommon("browseCatalog")}
            </Link>
          </Button>
            {primaryCourse ? (
              <Button asChild variant="nav" className="border border-border/60 bg-background/82">
              <Link href={`/courses/${primaryCourse.courseId}`} locale={params.locale}>
                {tCommon("resumeCourse")}
              </Link>
              </Button>
            ) : null}
          </>
        }
      />

      {approved.length ? <StudentEnrollmentSummaryStrip enrollments={approved} /> : null}

      {approved.length ? (
        <OperationsFilters
          locale={params.locale}
          title={t("filtersTitle")}
          description={t("filtersDescription")}
          searchLabel={t("searchLabel")}
          searchPlaceholder={t("searchPlaceholder")}
          query={filters.q}
          resultsCount={filteredApproved.length}
          resultsSummary={t("summary", {
            count: filteredApproved.length,
            total: approved.length,
            label: t("label"),
          })}
          resetHref="/student/courses"
          selects={[
            {
              name: "sort",
              label: t("sort"),
              value: filters.sort,
              options: [
                { value: "recent", label: t("mostRecent") },
                { value: "title-asc", label: t("courseAsc") },
                { value: "teacher-asc", label: t("teacherAsc") },
              ] as const,
            },
          ]}
        />
      ) : null}

      {primaryCourse ? (
        <Card tone="strong">
          <CardHeader>
            <CardTitle>{t("primaryTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-foreground">{primaryCourse.courseTitle}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {t("primaryDescription")}
              </p>
            </div>
            <Button asChild variant="hero">
              <Link href={`/courses/${primaryCourse.courseId}`} locale={params.locale}>
                {tCommon("resumeCourse")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {approved.length ? (
        paginatedApproved.items.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {paginatedApproved.items.map((enrollment) => (
              <StudentEnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                locale={params.locale}
                mode="active"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            badge={t("noMatchesBadge")}
            title={t("noMatchesTitle")}
            description={t("noMatchesDescription")}
            action={{
              label: tCommon("resetFilters"),
              href: "/student/courses",
              locale: params.locale,
              variant: "outline",
            }}
          />
        )
      ) : (
          <EmptyState
            icon={BookOpen}
            badge={t("emptyBadge")}
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

      <ServerPagination
        locale={params.locale}
        pathname="/student/courses"
        searchParams={searchParams}
        currentPage={paginatedApproved.currentPage}
        totalPages={paginatedApproved.totalPages}
        totalItems={paginatedApproved.totalItems}
        startIndex={paginatedApproved.startIndex}
        endIndex={paginatedApproved.endIndex}
        label={t("label")}
      />
    </div>
  );
}
