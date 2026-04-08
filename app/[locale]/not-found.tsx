import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/layout/page-frame";
import { StatusPanel } from "@/components/layout/status-panel";
import { Link } from "@/lib/navigation";

export default function NotFoundPage() {
  const t = useTranslations("errors");

  return (
    <PageFrame className="flex min-h-screen items-center py-12 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <StatusPanel
          badge="404"
          title={t("pageNotFound")}
          description={t("pageNotFoundDescription")}
        >
          <Button asChild className="rounded-full">
            <Link href="/">{t("goBack")}</Link>
          </Button>
        </StatusPanel>
      </div>
    </PageFrame>
  );
}
