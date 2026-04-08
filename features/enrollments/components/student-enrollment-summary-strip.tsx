import { useTranslations } from "next-intl";
import type { StudentEnrollmentRowData } from "@/lib/types/domain";
import { MetricPanel } from "@/features/dashboard/components/metric-panel";

type Props = {
  enrollments: StudentEnrollmentRowData[];
};

export function StudentEnrollmentSummaryStrip({ enrollments }: Props) {
  const t = useTranslations("enrollments.summary");
  const approvedCount = enrollments.filter((item) => item.status === "approved").length;
  const pendingCount = enrollments.filter((item) => item.status === "pending").length;
  const rejectedCount = enrollments.filter((item) => item.status === "rejected").length;
  const mostRecentApproved = enrollments.find((item) => item.status === "approved");

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
      <MetricPanel
        label={t("title")}
        value={approvedCount ? t("activeTitle") : t("pendingTitle")}
        description={
          mostRecentApproved
            ? t("activeDescription", { course: mostRecentApproved.courseTitle })
            : t("fallbackDescription")
        }
        tone="soft"
      />
      {[
        {
          label: t("approvedLabel"),
          value: approvedCount,
          description: t("approvedDescription"),
          tone: "accent" as const,
        },
        {
          label: t("pendingLabel"),
          value: pendingCount,
          description: t("pendingDescription"),
          tone: "soft" as const,
        },
        {
          label: t("rejectedLabel"),
          value: rejectedCount,
          description: t("rejectedDescription"),
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
