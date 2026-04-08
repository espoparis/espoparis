import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import { PageFrame } from "@/components/layout/page-frame";
import { UnauthorizedState } from "@/components/ui/unauthorized-state";
import { Button } from "@/components/ui/button";

export default async function UnauthorizedPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "status.unauthorized" });
  const tCommon = await getTranslations({ locale: params.locale, namespace: "common.actions" });

  return (
    <PageFrame className="flex min-h-[70vh] items-center py-12 sm:py-14">
      <div className="mx-auto w-full max-w-xl space-y-5">
        <UnauthorizedState
          title={t("title")}
          description={t("description")}
          footer={t("footer")}
        />
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/auth/login" locale={params.locale}>
              {tCommon("backToSignIn")}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/dashboard" locale={params.locale}>
              {tCommon("openWorkspace")}
            </Link>
          </Button>
        </div>
      </div>
    </PageFrame>
  );
}
