import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/navigation";

type Props = {
  locale: string;
  pathname: string;
  searchParams?: Record<string, string | string[] | undefined>;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  label: string;
};

function buildHref(
  pathname: string,
  searchParams: Record<string, string | string[] | undefined> | undefined,
  page: number
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (key === "page" || value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
      continue;
    }

    if (value !== "") {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, start + 2);
  const normalizedStart = Math.max(1, end - 2);
  const pages: number[] = [];

  for (let page = normalizedStart; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export async function ServerPagination({
  locale,
  pathname,
  searchParams,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  label,
}: Props) {
  const t = await getTranslations({ locale, namespace: "common.pagination" });

  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const previousHref = buildHref(pathname, searchParams, currentPage - 1);
  const nextHref = buildHref(pathname, searchParams, currentPage + 1);

  return (
    <Card tone="soft" className="overflow-hidden">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {t("showingRange", {
              start: startIndex + 1,
              end: endIndex,
              total: totalItems,
              label,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em]">
              {label}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-[0.7rem] tracking-[0.02em]">
              {currentPage} / {totalPages}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentPage > 1 ? (
            <Button asChild variant="outline" size="sm">
              <Link href={previousHref} locale={locale}>
                <ChevronLeft className="h-4 w-4" />
                {t("previous")}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              {t("previous")}
            </Button>
          )}

          <div className="surface-subtle flex items-center gap-1 p-1">
            {visiblePages.map((page) => (
              <Button
                key={page}
                asChild
                variant={page === currentPage ? "default" : "nav"}
                size="sm"
                className="min-w-9"
              >
                <Link href={buildHref(pathname, searchParams, page)} locale={locale}>
                  {page}
                </Link>
              </Button>
            ))}
          </div>

          {currentPage < totalPages ? (
            <Button asChild variant="outline" size="sm">
              <Link href={nextHref} locale={locale}>
                {t("next")}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
