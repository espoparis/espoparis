import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { Button } from "@/components/ui/button";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TeacherCourseCard } from "@/features/courses/components/teacher-course-card";
import { TeacherCourseSummaryStrip } from "@/features/courses/components/teacher-course-summary-strip";
import { Link } from "@/lib/navigation";
import { coercePage, paginateItems } from "@/lib/pagination";
import { requireApprovedRole } from "@/server/auth/session";
import { listTeacherCourses } from "@/server/queries/courses";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { teacherCourseFilterSchema } from "@/lib/validation/operations";

export default async function TeacherCoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.teacherCourses" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "teacher");
  const courses = await listTeacherCourses(profile.id);
  const filters = teacherCourseFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    status: Array.isArray(searchParams?.status)
      ? searchParams?.status[0]
      : searchParams?.status,
    type: Array.isArray(searchParams?.type) ? searchParams?.type[0] : searchParams?.type,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });
  const normalizedQuery = filters.q.toLowerCase();
  const filteredCourses = courses
    .filter((course) => {
      const matchesQuery =
        !normalizedQuery ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.description.toLowerCase().includes(normalizedQuery);
      const matchesStatus = filters.status === "all" || course.status === filters.status;
      const matchesType = filters.type === "all" || course.type === filters.type;

      return matchesQuery && matchesStatus && matchesType;
    })
    .sort((left, right) => {
      if (filters.sort === "title-asc") {
        return left.title.localeCompare(right.title);
      }

      if (filters.sort === "title-desc") {
        return right.title.localeCompare(left.title);
      }

      return 0;
    });
  const page = coercePage(searchParams?.page);
  const paginatedCourses = paginateItems(filteredCourses, page, 6);

  return (
    <div className="space-y-6">
      <WorkspaceHero
        title={t("title")}
        description={t("description")}
        actions={
          <Button asChild variant="hero">
          <Link href="/teacher/courses/new" locale={params.locale}>
            <Plus className="h-4 w-4" />
            {tCommon("newCourse")}
          </Link>
          </Button>
        }
      />

      {courses.length ? (
        <TeacherCourseSummaryStrip locale={params.locale} courses={courses} />
      ) : null}

      {courses.length ? (
        <OperationsFilters
          locale={params.locale}
          title={t("filtersTitle")}
          description={t("filtersDescription")}
          searchLabel={t("searchLabel")}
          searchPlaceholder={t("searchPlaceholder")}
          query={filters.q}
          resultsCount={filteredCourses.length}
          resultsSummary={t("summary", {
            count: filteredCourses.length,
            total: courses.length,
            label: t("label"),
          })}
          resetHref="/teacher/courses"
          selects={[
            {
              name: "status",
              label: t("status"),
              value: filters.status,
              options: [
                { value: "all", label: t("allStatuses") },
                { value: "draft", label: t("draft") },
                { value: "published", label: t("published") },
                { value: "archived", label: t("archived") },
              ] as const,
            },
            {
              name: "type",
              label: t("format"),
              value: filters.type,
              options: [
                { value: "all", label: t("allFormats") },
                { value: "diploma", label: t("diploma") },
                { value: "bachelors", label: t("bachelors") },
              ] as const,
            },
            {
              name: "sort",
              label: t("sort"),
              value: filters.sort,
              options: [
                { value: "recent", label: t("mostRecent") },
                { value: "title-asc", label: t("titleAsc") },
                { value: "title-desc", label: t("titleDesc") },
              ] as const,
            },
          ]}
        />
      ) : null}

      {courses.length ? (
        filteredCourses.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {paginatedCourses.items.map((course) => (
              <TeacherCourseCard key={course.id} course={course} locale={params.locale} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Plus}
            badge={t("noMatchesBadge")}
            title={t("noMatchesTitle")}
            description={t("noMatchesDescription")}
            action={{
              label: tCommon("resetFilters"),
              href: "/teacher/courses",
              locale: params.locale,
              variant: "outline",
            }}
          />
        )
      ) : (
        <EmptyState
          icon={Plus}
          badge={t("emptyBadge")}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={{
            label: tCommon("newCourse"),
            href: "/teacher/courses/new",
            locale: params.locale,
          }}
        />
      )}

      <ServerPagination
        locale={params.locale}
        pathname="/teacher/courses"
        searchParams={searchParams}
        currentPage={paginatedCourses.currentPage}
        totalPages={paginatedCourses.totalPages}
        totalItems={paginatedCourses.totalItems}
        startIndex={paginatedCourses.startIndex}
        endIndex={paginatedCourses.endIndex}
        label={t("label")}
      />
    </div>
  );
}
