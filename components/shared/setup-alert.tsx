import { getTranslations } from "next-intl/server";
import { AlertCircle } from "lucide-react";
import { StatusPanel } from "@/components/layout/status-panel";

export async function SetupAlert({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const t = await getTranslations("status.setup");

  return (
    <StatusPanel
      badge={t("title")}
      title={title ?? t("title")}
      description={description ?? t("description")}
      icon={<AlertCircle className="h-5 w-5" />}
      className="max-w-3xl"
    >
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("footer")}</p>
    </StatusPanel>
  );
}
