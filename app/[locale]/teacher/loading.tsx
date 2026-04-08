import { getLocale, getTranslations } from "next-intl/server";
import { PageLoadingShell } from "@/components/shared/page-loading-shell";

export default async function TeacherLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "status.loading" });

  return (
    <PageLoadingShell
      eyebrow={t("teacherEyebrow")}
      title={t("teacherTitle")}
      description={t("teacherDescription")}
      cards={4}
    />
  );
}
