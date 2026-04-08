import { getLocale, getTranslations } from "next-intl/server";
import { PageLoadingShell } from "@/components/shared/page-loading-shell";

export default async function AdminLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "status.loading" });

  return (
    <PageLoadingShell
      eyebrow={t("adminEyebrow")}
      title={t("adminTitle")}
      description={t("adminDescription")}
      cards={4}
    />
  );
}
