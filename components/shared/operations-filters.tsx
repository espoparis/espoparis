import { getTranslations } from "next-intl/server";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Link } from "@/lib/navigation";

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelect = {
  name: string;
  label: string;
  value: string;
  options: readonly FilterOption[];
};

type Props = {
  locale: string;
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  query: string;
  resultsCount: number;
  resultsSummary?: string;
  resetHref: string;
  selects?: FilterSelect[];
};

export async function OperationsFilters({
  locale,
  title,
  description,
  searchLabel,
  searchPlaceholder,
  query,
  resultsCount,
  resultsSummary,
  resetHref,
  selects = [],
}: Props) {
  const hasActiveFilters =
    query.length > 0 || selects.some((select) => select.value !== select.options[0]?.value);
  const tCommon = await getTranslations({ locale, namespace: "common.actions" });
  const resultsText = resultsSummary ?? `${resultsCount} result${resultsCount === 1 ? "" : "s"}`;
  const formClassName =
    selects.length >= 3
      ? "grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_220px_220px_220px_auto] lg:items-end"
      : selects.length === 2
      ? "grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_220px_220px_auto] lg:items-end"
      : selects.length === 1
        ? "grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_220px_auto] lg:items-end"
        : "grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_auto] lg:items-end";
  return (
    <Card tone="strong" className="display-shadow overflow-hidden">
      <CardContent className="flex flex-col gap-6 p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="surface-subtle flex size-9 shrink-0 items-center justify-center text-primary">
              <Filter className="size-4" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="section-eyebrow">{title}</p>
                <Badge variant="muted" className="px-3 py-1 text-[0.7rem] tracking-[0.02em]">
                  {resultsText}
                </Badge>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <form className={formClassName}>
          <div className="flex flex-col gap-2">
            <label htmlFor="q" className="text-sm font-medium text-foreground">
              {searchLabel}
            </label>
            <div className="surface-subtle relative flex h-11 items-center px-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="q"
                name="q"
                defaultValue={query}
                placeholder={searchPlaceholder}
                className="h-full rounded-none border-0 bg-transparent px-0 pl-7 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {selects.map((select) => (
            <div key={select.name} className="flex flex-col gap-2">
              <label htmlFor={select.name} className="text-sm font-medium text-foreground">
                {select.label}
              </label>
              <Select
                id={select.name}
                name={select.name}
                defaultValue={select.value}
              >
                {select.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Button type="submit" className="h-11 px-5">
              <SlidersHorizontal className="h-4 w-4" />
              {tCommon("updateView")}
            </Button>
            {hasActiveFilters ? (
              <Button asChild type="button" variant="outline" className="h-11 px-5">
                <Link href={resetHref} locale={locale}>
                  {tCommon("resetFilters")}
                </Link>
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
