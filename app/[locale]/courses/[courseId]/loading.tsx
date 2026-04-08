import { getLocale, getTranslations } from "next-intl/server";
import { PageLoadingShell } from "@/components/shared/page-loading-shell";

export default async function CourseDetailLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "status.loading" });

  return (
    <PageLoadingShell
      eyebrow={t("courseEyebrow")}
      title={t("courseTitle")}
      description={t("courseDescription")}
      cards={3}
    />
  );
}
