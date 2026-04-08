import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageFrame } from "@/components/layout/page-frame";
import { ServerPagination } from "@/components/shared/server-pagination";
import { SetupAlert } from "@/components/shared/setup-alert";
import { CatalogFilters } from "@/features/courses/components/catalog-filters";
import { CourseCard } from "@/features/courses/components/course-card";
import type { CourseCardData } from "@/lib/types/domain";
import type { PaginatedResult } from "@/lib/pagination";

type CatalogFiltersValue = {
  query: string;
  type: "all" | "diploma" | "bachelors";
  level: "all" | "beginner" | "intermediate" | "advanced";
  sort: "recent" | "title-asc" | "rating-desc";
};

type Props = {
  locale: string;
  searchParams?: Record<string, string | string[] | undefined>;
  filters: CatalogFiltersValue;
  allCoursesCount: number;
  paginatedCourses: PaginatedResult<CourseCardData>;
  isConfigured: boolean;
  emptyBadge: string;
  emptyTitle: string;
  emptyDescription: string;
  resetLabel: string;
};

export function CatalogResultsSection({
  locale,
  searchParams,
  filters,
  allCoursesCount,
  paginatedCourses,
  isConfigured,
  emptyBadge,
  emptyTitle,
  emptyDescription,
  resetLabel,
}: Props) {
  return (
    <PageFrame className="py-8 lg:py-10">
      <section className="space-y-8 lg:space-y-10">
        <CatalogFilters
          locale={locale}
          filters={filters}
          resultsCount={allCoursesCount}
        />

        {!isConfigured ? <SetupAlert /> : null}

        {isConfigured && allCoursesCount ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedCourses.items.map((course) => (
              <CourseCard key={course.id} course={course} locale={locale} />
            ))}
          </div>
        ) : null}

        {isConfigured && !allCoursesCount ? (
          <EmptyState
            icon={Search}
            badge={emptyBadge}
            title={emptyTitle}
            description={emptyDescription}
            action={{
              label: resetLabel,
              href: "/courses",
              locale,
              variant: "outline",
            }}
          />
        ) : null}

        <ServerPagination
          locale={locale}
          pathname="/courses"
          searchParams={searchParams}
          currentPage={paginatedCourses.currentPage}
          totalPages={paginatedCourses.totalPages}
          totalItems={paginatedCourses.totalItems}
          startIndex={paginatedCourses.startIndex}
          endIndex={paginatedCourses.endIndex}
          label="courses"
        />
      </section>
    </PageFrame>
  );
}
