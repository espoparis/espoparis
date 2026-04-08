import { getTranslations } from "next-intl/server";
import { isSupabaseConfigured } from "@/lib/env";
import { coercePage, paginateItems } from "@/lib/pagination";
import { listPublishedCourses } from "@/server/queries/courses";
import { courseCatalogFilterSchema } from "@/lib/validation/course";
import { CatalogHero } from "@/features/courses/components/catalog-hero";
import { CatalogResultsSection } from "@/features/courses/components/catalog-results-section";

export default async function CoursesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "catalog" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  const parsedFilters = courseCatalogFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    type: Array.isArray(searchParams?.type)
      ? searchParams?.type[0]
      : searchParams?.type,
    level: Array.isArray(searchParams?.level)
      ? searchParams?.level[0]
      : searchParams?.level,
    sort: Array.isArray(searchParams?.sort)
      ? searchParams?.sort[0]
      : searchParams?.sort,
  });
  const isConfigured = isSupabaseConfigured();

  const courses = isConfigured
    ? await listPublishedCourses({
        query: parsedFilters.q,
        type: parsedFilters.type,
        level: parsedFilters.level,
      })
    : [];
  const sortedCourses = [...courses].sort((left, right) => {
    if (parsedFilters.sort === "title-asc") {
      return left.title.localeCompare(right.title);
    }

    if (parsedFilters.sort === "rating-desc") {
      return (right.averageRating ?? -1) - (left.averageRating ?? -1);
    }

    return 0;
  });
  const page = coercePage(searchParams?.page);
  const paginatedCourses = paginateItems(sortedCourses, page, 9);

  return (
    <div className="flex flex-1 flex-col">
      <CatalogHero
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        focusEyebrow={t("focusEyebrow")}
        focusDescription={t("focusDescription")}
        surfaceOne={t("surfaceOne")}
        surfaceTwo={t("surfaceTwo")}
      />

      <CatalogResultsSection
        locale={params.locale}
        searchParams={searchParams}
        filters={{
          query: parsedFilters.q,
          type: parsedFilters.type,
          level: parsedFilters.level,
          sort: parsedFilters.sort,
        }}
        allCoursesCount={sortedCourses.length}
        paginatedCourses={paginatedCourses}
        isConfigured={isConfigured}
        emptyBadge={t("noMatchesBadge")}
        emptyTitle={t("emptyTitle")}
        emptyDescription={t("emptyDescription")}
        resetLabel={tCommon("resetFilters")}
      />
    </div>
  );
}
