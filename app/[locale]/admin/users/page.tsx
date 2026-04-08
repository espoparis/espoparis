import { getTranslations } from "next-intl/server";
import { Inbox } from "lucide-react";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { OperationsFilters } from "@/components/shared/operations-filters";
import { ServerPagination } from "@/components/shared/server-pagination";
import { AdminUserCard } from "@/features/admin/components/admin-user-card";
import { AdminSummaryStrip } from "@/features/admin/components/admin-summary-strip";
import { requireAdmin } from "@/server/auth/session";
import { listProfiles } from "@/server/repositories/profiles";
import { SetupAlert } from "@/components/shared/setup-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { isSupabaseConfigured } from "@/lib/env";
import { coercePage, paginateItems } from "@/lib/pagination";
import { adminUserFilterSchema } from "@/lib/validation/operations";

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "operations.adminUsers" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });
  if (!isSupabaseConfigured()) {
    return <SetupAlert />;
  }

  await requireAdmin(params.locale);
  const profiles = await listProfiles();
  const filters = adminUserFilterSchema.parse({
    q: Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q,
    role: Array.isArray(searchParams?.role) ? searchParams?.role[0] : searchParams?.role,
    status: Array.isArray(searchParams?.status)
      ? searchParams?.status[0]
      : searchParams?.status,
    sort: Array.isArray(searchParams?.sort) ? searchParams?.sort[0] : searchParams?.sort,
  });
  const searchQuery = filters.q.toLowerCase();
  const filteredProfiles = profiles
    .filter((profile) => {
      const matchesQuery =
        searchQuery.length === 0 ||
        profile.full_name.toLowerCase().includes(searchQuery) ||
        (profile.email ?? "").toLowerCase().includes(searchQuery) ||
        profile.bio.toLowerCase().includes(searchQuery);
      const matchesRole = filters.role === "all" || profile.role === filters.role;
      const matchesStatus =
        filters.status === "all" || profile.approval_status === filters.status;

      return matchesQuery && matchesRole && matchesStatus;
    })
    .sort((left, right) => {
      if (filters.sort === "name-asc") {
        return left.full_name.localeCompare(right.full_name);
      }

      if (filters.sort === "name-desc") {
        return right.full_name.localeCompare(left.full_name);
      }

      return 0;
    });
  const totalUsers = profiles.length;
  const pendingUsers = profiles.filter((profile) => profile.approval_status === "pending").length;
  const totalTeachers = profiles.filter((profile) => profile.role === "teacher").length;
  const totalStudents = profiles.filter((profile) => profile.role === "student").length;
  const page = coercePage(searchParams?.page);
  const paginatedProfiles = paginateItems(filteredProfiles, page, 6);
  const pendingProfiles = paginatedProfiles.items.filter(
    (profile) => profile.approval_status === "pending"
  );
  const activeProfiles = paginatedProfiles.items.filter(
    (profile) => profile.approval_status !== "pending"
  );
  const hasActiveFilters =
    filters.q.length > 0 || filters.role !== "all" || filters.status !== "all";

  return (
    <div className="space-y-6">
      <WorkspaceHero title={t("title")} description={t("description")} />

      <AdminSummaryStrip
        items={[
          {
            label: t("totalUsersLabel"),
            value: totalUsers,
            description: t("totalUsersDescription"),
            tone: "strong",
          },
          {
            label: t("pendingLabel"),
            value: pendingUsers,
            description: t("pendingDescription"),
            tone: "soft",
          },
          {
            label: t("mixLabel"),
            value: `${totalTeachers}/${totalStudents}`,
            description: t("mixDescription"),
            tone: "accent",
          },
        ]}
        narrative={t("narrative")}
      />

      <OperationsFilters
        locale={params.locale}
        title={t("filtersTitle")}
        description={t("filtersDescription")}
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        query={filters.q}
        resultsCount={filteredProfiles.length}
        resultsSummary={t("summary", {
          count: filteredProfiles.length,
          total: totalUsers,
          label: t("label"),
        })}
        resetHref="/admin/users"
        selects={[
          {
            name: "role",
            label: t("role"),
            value: filters.role,
            options: [
              { value: "all", label: t("allRoles") },
              { value: "admin", label: t("admin") },
              { value: "teacher", label: t("teacher") },
              { value: "student", label: t("student") },
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
              { value: "recent", label: t("newestFirst") },
              { value: "name-asc", label: t("nameAsc") },
              { value: "name-desc", label: t("nameDesc") },
            ] as const,
          },
        ]}
      />

      {filteredProfiles.length ? (
        <>
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{t("pendingSectionTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("pendingSectionDescription")}
              </p>
            </div>
            {pendingProfiles.length ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {pendingProfiles.map((profile) => (
                  <AdminUserCard key={profile.id} locale={params.locale} profile={profile} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Inbox}
                badge={t("pendingLabel")}
                title={t("pendingEmptyTitle")}
                description={t("pendingEmptyDescription")}
              />
            )}
          </section>

          {activeProfiles.length ? (
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{t("activeSectionTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("activeSectionDescription")}
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {activeProfiles.map((profile) => (
                  <AdminUserCard key={profile.id} locale={params.locale} profile={profile} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <EmptyState
          icon={Inbox}
          badge={hasActiveFilters ? t("noMatchesBadge") : t("rosterBadge")}
          title={hasActiveFilters ? t("noMatchesTitle") : t("emptyTitle")}
          description={
            hasActiveFilters
              ? t("noMatchesDescription")
              : t("emptyDescription")
          }
          action={
            hasActiveFilters
              ? {
                  label: tCommon("resetFilters"),
                  href: "/admin/users",
                  locale: params.locale,
                  variant: "outline",
                }
              : undefined
          }
        />
      )}

      <ServerPagination
        locale={params.locale}
        pathname="/admin/users"
        searchParams={searchParams}
        currentPage={paginatedProfiles.currentPage}
        totalPages={paginatedProfiles.totalPages}
        totalItems={paginatedProfiles.totalItems}
        startIndex={paginatedProfiles.startIndex}
        endIndex={paginatedProfiles.endIndex}
        label={t("label")}
      />
    </div>
  );
}
