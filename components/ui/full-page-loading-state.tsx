import { getTranslations } from "next-intl/server";
import { BrandLoader } from "@/components/ui/loader";

interface FullPageLoadingStateProps {
  title?: string;
  description?: string;
}

export async function FullPageLoadingState({
  title,
  description,
}: FullPageLoadingStateProps) {
  const t = await getTranslations("status.loading");

  return (
    <div className="flex min-h-[72vh] items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-16">
      <BrandLoader
        label={`${t("badge")}. ${title ?? t("title")}. ${description ?? t("description")}`}
      />
    </div>
  );
}
