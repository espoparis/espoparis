import { useLocale, useTranslations } from "next-intl";
import type { PublicCatalogStats } from "@/server/queries/marketing";

type Props = {
  stats: PublicCatalogStats;
};

export function PublicStatsStrip({ stats }: Props) {
  const t = useTranslations("home.stats");
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(locale);

  const items = [
    {
      label: t("publishedCourses"),
      value: `+${numberFormatter.format(stats.publishedCourses)}`,
    },
    {
      label: t("approvedTeachers"),
      value: `+${numberFormatter.format(stats.approvedTeachers)}`,
    },
    {
      label: t("approvedEnrollments"),
      value: `+${numberFormatter.format(stats.approvedEnrollments)}`,
    },
  ];

  return (
    <section className="py-6 md:py-8">
      <div className="w-full space-y-5 md:space-y-8">
        <div className="relative z-10 mx-auto max-w-3xl space-y-5 text-center">
          <h2 className="font-display text-[clamp(2.35rem,5.5vw,3.5rem)] font-medium tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {t("description")}
          </p>
        </div>

        <div className="border-t border-border/70 pt-6 md:pt-8">
          <div className="grid w-full gap-8 md:grid-cols-3 md:gap-0">
            {items.map((item) => (
              <div
                key={item.label}
                className={`space-y-3 py-6 text-center md:px-6 md:py-0 `}
              >
                <div className="font-display text-[clamp(2.75rem,5vw,4.5rem)] font-bold tracking-tight text-foreground">
                  {item.value}
                </div>
                <p className="text-base font-medium text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
