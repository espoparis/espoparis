import { getTranslations } from "next-intl/server";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Link } from "@/lib/navigation";

type CatalogFilters = {
  query: string;
  type: "all" | "diploma" | "bachelors";
  level: "all" | "beginner" | "intermediate" | "advanced";
  sort: "recent" | "title-asc" | "rating-desc";
};

type Props = {
  locale: string;
  filters: CatalogFilters;
  resultsCount: number;
};

export async function CatalogFilters({ locale, filters, resultsCount }: Props) {
  const t = await getTranslations({ locale, namespace: "catalog.filters" });
  const tCommon = await getTranslations({ locale, namespace: "common.actions" });
  const hasActiveFilters =
    filters.query.length > 0 ||
    filters.type !== "all" ||
    filters.level !== "all" ||
    filters.sort !== "recent";

  const typeOptions = [
    { value: "all", label: t("allFormats") },
    { value: "diploma", label: t("diploma") },
    { value: "bachelors", label: t("bachelors") },
  ] as const;

  const levelOptions = [
    { value: "all", label: t("allLevels") },
    { value: "beginner", label: t("beginner") },
    { value: "intermediate", label: t("intermediate") },
    { value: "advanced", label: t("advanced") },
  ] as const;

  const sortOptions = [
    { value: "recent", label: t("mostRecent") },
    { value: "title-asc", label: t("titleAsc") },
    { value: "rating-desc", label: t("topRated") },
  ] as const;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Filter className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.3em]">{t("title")}</p>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-[0_12px_30px_-26px_hsl(var(--foreground)/0.18)] backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-primary/80" />
          {resultsCount.toLocaleString(locale)} results
        </div>
      </div>

      <div className="hairline-divider" />

      <form className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.72fr))_auto] xl:items-end">
        <div className="field-stack">
          <label htmlFor="q" className="text-sm font-medium text-foreground">
            {t("searchLabel")}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="q"
              name="q"
              size="lg"
              variant="secondary"
              defaultValue={filters.query}
              placeholder={t("searchPlaceholder")}
              className="pl-10"
            />
          </div>
        </div>

        <div className="field-stack">
          <label htmlFor="type" className="text-sm font-medium text-foreground">
            {t("format")}
          </label>
          <Select
            id="type"
            name="type"
            size="lg"
            variant="secondary"
            defaultValue={filters.type}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="field-stack">
          <label htmlFor="level" className="text-sm font-medium text-foreground">
            {t("level")}
          </label>
          <Select
            id="level"
            name="level"
            size="lg"
            variant="secondary"
            defaultValue={filters.level}
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="field-stack">
          <label htmlFor="sort" className="text-sm font-medium text-foreground">
            {t("sort")}
          </label>
          <Select
            id="sort"
            name="sort"
            size="lg"
            variant="secondary"
            defaultValue={filters.sort}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-3 xl:justify-end">
          <Button type="submit" variant="hero" size="lg">
            <SlidersHorizontal className="h-4 w-4" />
            {tCommon("updateView")}
          </Button>
          {hasActiveFilters ? (
            <Button asChild type="button" variant="nav" size="lg">
              <Link href="/courses" locale={locale}>
                {tCommon("resetFilters")}
              </Link>
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
