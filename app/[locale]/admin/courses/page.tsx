import { getTranslations } from "next-intl/server";
import { AdminCourseCard } from "@/features/admin/components/admin-course-card";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { requireAdmin } from "@/server/auth/session";
import { listAllCourses } from "@/server/queries/courses";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, AlertTriangle, Archive } from "lucide-react";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { AdminSummaryStrip } from "@/features/admin/components/admin-summary-strip";
import { coercePage, paginateItems } from "@/lib/pagination";
import { adminCourseFilterSchema } from "@/lib/validation/operations";

function isWatchlistCourse(course: {
  status: string;
  reviewCount: number;
  averageRating: number | null;
}) {
  return (
    course.status === "draft" ||
    (course.status === "published" &&
      (course.reviewCount === 0 || (course.averageRating ?? 0) < 4))
  );
}

export default async function AdminCoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.adminCourses" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  await requireAdmin(params.locale);
  const courses = await listAllCourses();
  const filters = adminCourseFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    lane: Array.isArray(searchParams?.lane) ? searchParams?.lane[0] : searchParams?.lane,
    status: Array.isArray(searchParams?.status)
      ? searchParams?.status[0]
      : searchParams?.status,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((course) => course.status === "published").length;
  const archivedCourses = courses.filter((course) => course.status === "archived").length;
  const totalWatchlistCourses = courses.filter(isWatchlistCourse).length;
  const normalizedQuery = filters.q.toLowerCase();
  const filteredCourses = courses
    .filter((course) => {
      const matchesQuery =
        !normalizedQuery ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.description.toLowerCase().includes(normalizedQuery) ||
        course.teacherName.toLowerCase().includes(normalizedQuery);
      const matchesStatus = filters.status === "all" || course.status === filters.status;
      const lane =
        course.status === "archived"
          ? "archive"
          : isWatchlistCourse(course)
            ? "watchlist"
            : "live";
      const matchesLane = filters.lane === "all" || lane === filters.lane;

      return matchesQuery && matchesStatus && matchesLane;
    })
    .sort((left, right) => {
      if (filters.sort === "title-asc") {
        return left.title.localeCompare(right.title);
      }

      if (filters.sort === "rating-desc") {
        return (right.averageRating ?? -1) - (left.averageRating ?? -1);
      }

      return 0;
    });
  const page = coercePage(searchParams?.page);
  const paginatedCourses = paginateItems(filteredCourses, page, 6);
  const watchlistCourses = paginatedCourses.items.filter(isWatchlistCourse);
  const liveCourses = paginatedCourses.items.filter(
    (course) => course.status === "published" && !isWatchlistCourse(course)
  );
  const archivedOnlyCourses = paginatedCourses.items.filter((course) => course.status === "archived");
  const hasFilteredResults = filteredCourses.length > 0;
  const showWatchlist = filters.lane === "all" || filters.lane === "watchlist";
  const showLive = filters.lane === "all" || filters.lane === "live";
  const showArchive = filters.lane === "all" || filters.lane === "archive";

  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("badge")}
        title={t("title")}
        description={t("description")}
      />

      {courses.length ? (
        <>
          <AdminSummaryStrip
            items={[
              {
                label: t("publishedLabel"),
                value: publishedCourses,
                description: t("publishedDescription"),
                tone: "accent",
              },
              {
                label: t("watchlistLabel"),
                value: totalWatchlistCourses,
                description: t("watchlistDescription"),
                tone: "soft",
              },
              {
                label: t("archivedLabel"),
                value: archivedCourses,
                description: t("archivedDescription"),
                tone: "subtle",
              },
            ]}
            narrative={t("narrative", { count: totalCourses })}
          />

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
              total: totalCourses,
              label: t("label"),
            })}
            resetHref="/admin/courses"
            selects={[
              {
                name: "lane",
                label: t("lane"),
                value: filters.lane,
                options: [
                  { value: "all", label: t("allLanes") },
                  { value: "watchlist", label: t("watchlistLane") },
                  { value: "live", label: t("liveLane") },
                  { value: "archive", label: t("archiveLane") },
                ] as const,
              },
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
                name: "sort",
                label: t("sort"),
                value: filters.sort,
                options: [
                  { value: "recent", label: t("mostRecent") },
                  { value: "title-asc", label: t("titleAsc") },
                  { value: "rating-desc", label: t("highestRated") },
                ] as const,
              },
            ]}
          />

          {hasFilteredResults ? (
            <>
              {showWatchlist ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <div>
                      <h2 className="text-2xl font-semibold">{t("watchlistSectionTitle")}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("watchlistSectionDescription")}
                      </p>
                    </div>
                  </div>
                  {watchlistCourses.length ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {watchlistCourses.map((course) => (
                        <AdminCourseCard key={course.id} course={course} locale={params.locale} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={AlertTriangle}
                      badge={t("watchlistLabel")}
                      title={t("watchlistEmptyTitle")}
                      description={t("watchlistEmptyDescription")}
                    />
                  )}
                </section>
              ) : null}

              {showLive ? (
                <section className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{t("liveSectionTitle")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("liveSectionDescription")}
                    </p>
                  </div>
                  {liveCourses.length ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {liveCourses.map((course) => (
                        <AdminCourseCard key={course.id} course={course} locale={params.locale} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={BookOpen}
                      badge={t("liveLane")}
                      title={t("liveEmptyTitle")}
                      description={t("liveEmptyDescription")}
                    />
                  )}
                </section>
              ) : null}

              {showArchive ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-primary" />
                    <div>
                      <h2 className="text-2xl font-semibold">{t("archiveSectionTitle")}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("archiveSectionDescription")}
                      </p>
                    </div>
                  </div>
                  {archivedOnlyCourses.length ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {archivedOnlyCourses.map((course) => (
                        <AdminCourseCard key={course.id} course={course} locale={params.locale} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Archive}
                      badge={t("archiveLane")}
                      title={t("archiveEmptyTitle")}
                      description={t("archiveEmptyDescription")}
                    />
                  )}
                </section>
              ) : null}
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              badge={t("noMatchesBadge")}
              title={t("noMatchesTitle")}
              description={t("noMatchesDescription")}
              action={{
                label: tCommon("resetFilters"),
                href: "/admin/courses",
                locale: params.locale,
                variant: "outline",
              }}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={BookOpen}
          badge={t("emptyBadge")}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      )}

      <ServerPagination
        locale={params.locale}
        pathname="/admin/courses"
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
