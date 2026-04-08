import { getTranslations } from "next-intl/server";
import { Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { StudentEnrollmentCard } from "@/features/enrollments/components/student-enrollment-card";
import { StudentEnrollmentSummaryStrip } from "@/features/enrollments/components/student-enrollment-summary-strip";
import { requireApprovedRole } from "@/server/auth/session";
import { listStudentEnrollments } from "@/server/repositories/enrollments";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { coercePage, paginateItems } from "@/lib/pagination";
import { studentEnrollmentFilterSchema } from "@/lib/validation/operations";

export default async function StudentApplicationsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.studentApplications" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "student");
  const enrollments = await listStudentEnrollments(profile.id);
  const filters = studentEnrollmentFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    status: Array.isArray(searchParams?.status)
      ? searchParams?.status[0]
      : searchParams?.status,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });
  const normalizedQuery = filters.q.toLowerCase();
  const filteredEnrollments = enrollments
    .filter((enrollment) => {
      const matchesQuery =
        !normalizedQuery ||
        enrollment.courseTitle.toLowerCase().includes(normalizedQuery) ||
        enrollment.teacherName.toLowerCase().includes(normalizedQuery);
      const matchesStatus = filters.status === "all" || enrollment.status === filters.status;

      return matchesQuery && matchesStatus;
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
  const paginatedEnrollments = paginateItems(filteredEnrollments, page, 6);

  return (
    <div className="space-y-6">
      <WorkspaceHero
        title={t("title")}
        description={t("description")}
        badges={
          <>
            <Badge variant="secondary">{t("badge")}</Badge>
            <Badge variant="outline">{t("total", { count: enrollments.length })}</Badge>
          </>
        }
      />

      {enrollments.length ? <StudentEnrollmentSummaryStrip enrollments={enrollments} /> : null}

      {enrollments.length ? (
        <OperationsFilters
          locale={params.locale}
          title={t("filtersTitle")}
          description={t("filtersDescription")}
          searchLabel={t("searchLabel")}
          searchPlaceholder={t("searchPlaceholder")}
          query={filters.q}
          resultsCount={filteredEnrollments.length}
          resultsSummary={t("summary", {
            count: filteredEnrollments.length,
            total: enrollments.length,
            label: t("label"),
          })}
          resetHref="/student/applications"
          selects={[
            {
              name: "status",
              label: t("status"),
              value: filters.status,
              options: [
                { value: "all", label: t("allStatuses") },
                { value: "pending", label: t("pending") },
                { value: "approved", label: t("approved") },
                { value: "rejected", label: t("rejected") },
              ] as const,
            },
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

      {enrollments.length ? (
        paginatedEnrollments.items.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {paginatedEnrollments.items.map((enrollment) => (
              <StudentEnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                locale={params.locale}
                mode={enrollment.status === "approved" ? "active" : "application"}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock3}
            badge={t("noMatchesBadge")}
            title={t("noMatchesTitle")}
            description={t("noMatchesDescription")}
            action={{
              label: tCommon("resetFilters"),
              href: "/student/applications",
              locale: params.locale,
              variant: "outline",
            }}
          />
        )
      ) : (
        <EmptyState
          icon={Clock3}
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
        pathname="/student/applications"
        searchParams={searchParams}
        currentPage={paginatedEnrollments.currentPage}
        totalPages={paginatedEnrollments.totalPages}
        totalItems={paginatedEnrollments.totalItems}
        startIndex={paginatedEnrollments.startIndex}
        endIndex={paginatedEnrollments.endIndex}
        label={t("label")}
      />
    </div>
  );
}
