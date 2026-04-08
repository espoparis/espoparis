import { getLocale, getTranslations } from "next-intl/server";
import { PageLoadingShell } from "@/components/shared/page-loading-shell";

export default async function StudentLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "status.loading" });

  return (
    <PageLoadingShell
      eyebrow={t("studentEyebrow")}
      title={t("studentTitle")}
      description={t("studentDescription")}
      cards={4}
    />
  );
}
