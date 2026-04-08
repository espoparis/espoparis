import { getTranslations } from "next-intl/server";
import type { CourseCardData } from "@/lib/types/domain";
import { MetricPanel } from "@/features/dashboard/components/metric-panel";

type Props = {
  locale: string;
  courses: CourseCardData[];
};

export async function TeacherCourseSummaryStrip({ locale, courses }: Props) {
  const t = await getTranslations({
    locale,
    namespace: "operations.teacherCourses.summaryStrip",
  });
  const draftCount = courses.filter((course) => course.status === "draft").length;
  const publishedCount = courses.filter((course) => course.status === "published").length;
  const archivedCount = courses.filter((course) => course.status === "archived").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        {
          label: t("draft.label"),
          value: draftCount,
          description: t("draft.description"),
          tone: "soft" as const,
        },
        {
          label: t("published.label"),
          value: publishedCount,
          description: t("published.description"),
          tone: "soft" as const,
        },
        {
          label: t("archived.label"),
          value: archivedCount,
          description: t("archived.description"),
          tone: "subtle" as const,
        },
      ].map((item) => (
        <MetricPanel
          key={item.label}
          label={item.label}
          value={item.value}
          description={item.description}
          tone={item.tone}
        />
      ))}
    </div>
  );
}
