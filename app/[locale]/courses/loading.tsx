import { getLocale, getTranslations } from "next-intl/server";
import { PageLoadingShell } from "@/components/shared/page-loading-shell";

export default async function CoursesLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "status.loading" });

  return (
    <PageLoadingShell
      eyebrow={t("catalogEyebrow")}
      title={t("catalogTitle")}
      description={t("catalogDescription")}
      cards={6}
    />
  );
}
