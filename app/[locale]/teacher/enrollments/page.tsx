import { getTranslations } from "next-intl/server";
import { CheckCheck, Clock3, UserCheck } from "lucide-react";
import { SectionBlock } from "@/components/layout/section-block";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricPanel } from "@/features/dashboard/components/metric-panel";
import { EnrollmentReviewCard } from "@/features/enrollments/components/enrollment-review-card";
import { requireApprovedRole } from "@/server/auth/session";
import { listTeacherEnrollments } from "@/server/repositories/enrollments";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";
import { coercePage, paginateItems } from "@/lib/pagination";
import { teacherEnrollmentFilterSchema } from "@/lib/validation/operations";

export default async function TeacherEnrollmentsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.teacherEnrollments" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  const { profile } = await requireApprovedRole(params.locale, "teacher");
  const enrollments = await listTeacherEnrollments(profile.id);
  const filters = teacherEnrollmentFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    status: Array.isArray(searchParams?.status)
      ? searchParams?.status[0]
      : searchParams?.status,
    lane: Array.isArray(searchParams?.lane) ? searchParams?.lane[0] : searchParams?.lane,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });
  const normalizedQuery = filters.q.toLowerCase();
  const filteredEnrollments = enrollments
    .filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.studentName.toLowerCase().includes(normalizedQuery) ||
        item.courseTitle.toLowerCase().includes(normalizedQuery);
      const matchesStatus = filters.status === "all" || item.status === filters.status;
      const matchesLane =
        filters.lane === "all" ||
        (filters.lane === "queue" && item.status === "pending") ||
        (filters.lane === "reviewed" && item.status !== "pending");

      return matchesQuery && matchesStatus && matchesLane;
    })
    .sort((left, right) => {
      if (filters.sort === "student-asc") {
        return left.studentName.localeCompare(right.studentName);
      }

      if (filters.sort === "course-asc") {
        return left.courseTitle.localeCompare(right.courseTitle);
      }

      return 0;
    });
  const page = coercePage(searchParams?.page);
  const paginatedEnrollments = paginateItems(filteredEnrollments, page, 6);
  const pendingEnrollments = paginatedEnrollments.items.filter((item) => item.status === "pending");
  const reviewedEnrollments = paginatedEnrollments.items.filter((item) => item.status !== "pending");
  const pendingQueueCount = enrollments.filter((item) => item.status === "pending").length;
  const approvedCount = enrollments.filter((item) => item.status === "approved").length;
  const rejectedCount = enrollments.filter((item) => item.status === "rejected").length;
  const hasFilteredResults = filteredEnrollments.length > 0;
  const showPendingSection =
    filters.lane !== "reviewed" && (filters.status === "all" || filters.status === "pending");
  const showReviewedSection =
    filters.lane !== "queue" && (filters.status === "all" || filters.status !== "pending");

  return enrollments.length ? (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("badge")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: t("pendingLabel"),
            value: pendingQueueCount,
            description: t("pendingDescription"),
            icon: Clock3,
            tone: "strong" as const,
          },
          {
            label: t("approvedLabel"),
            value: approvedCount,
            description: t("approvedDescription"),
            icon: UserCheck,
            tone: "accent" as const,
          },
          {
            label: t("rejectedLabel"),
            value: rejectedCount,
            description: t("rejectedDescription"),
            icon: CheckCheck,
            tone: "subtle" as const,
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
        resultsCount={filteredEnrollments.length}
        resultsSummary={t("summary", {
          count: filteredEnrollments.length,
          total: enrollments.length,
          label: t("label"),
        })}
        resetHref="/teacher/enrollments"
        selects={[
          {
            name: "lane",
            label: t("lane"),
            value: filters.lane,
            options: [
              { value: "all", label: t("allLanes") },
              { value: "queue", label: t("queue") },
              { value: "reviewed", label: t("reviewed") },
            ] as const,
          },
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
              { value: "student-asc", label: t("studentAsc") },
              { value: "course-asc", label: t("courseAsc") },
            ] as const,
          },
        ]}
      />

      {hasFilteredResults ? (
        <>
          {showPendingSection ? (
            <SectionBlock
              title={t("sectionPendingTitle")}
              description={t("sectionPendingDescription")}
              contentClassName="grid gap-6 lg:grid-cols-2"
            >
              {pendingEnrollments.length ? (
                pendingEnrollments.map((enrollment) => (
                  <EnrollmentReviewCard
                    key={enrollment.id}
                    enrollment={enrollment}
                    locale={params.locale}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Clock3}
                  badge={t("pendingLabel")}
                  title={t("pendingEmptyTitle")}
                  description={t("pendingEmptyDescription")}
                />
              )}
            </SectionBlock>
          ) : null}

          {showReviewedSection && reviewedEnrollments.length ? (
            <SectionBlock
              title={t("sectionReviewedTitle")}
              description={t("sectionReviewedDescription")}
              contentClassName="grid gap-6 lg:grid-cols-2"
            >
              {reviewedEnrollments.map((enrollment) => (
                <EnrollmentReviewCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  locale={params.locale}
                />
              ))}
            </SectionBlock>
          ) : null}
        </>
      ) : (
        <EmptyState
          icon={CheckCheck}
          badge={t("noMatchesBadge")}
          title={t("noMatchesTitle")}
          description={t("noMatchesDescription")}
          action={{
            label: tCommon("resetFilters"),
            href: "/teacher/enrollments",
            locale: params.locale,
            variant: "outline",
          }}
        />
      )}

      <ServerPagination
        locale={params.locale}
        pathname="/teacher/enrollments"
        searchParams={searchParams}
        currentPage={paginatedEnrollments.currentPage}
        totalPages={paginatedEnrollments.totalPages}
        totalItems={paginatedEnrollments.totalItems}
        startIndex={paginatedEnrollments.startIndex}
        endIndex={paginatedEnrollments.endIndex}
        label={t("label")}
      />
    </div>
  ) : (
    <EmptyState
      icon={CheckCheck}
      badge={t("emptyBadge")}
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={{
        label: tCommon("viewAllCourses"),
        href: "/teacher/courses",
        locale: params.locale,
        variant: "outline",
      }}
    />
  );
}
