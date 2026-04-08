import { getTranslations } from "next-intl/server";
import { ResetPasswordSplitScreen } from "@/features/auth/components/reset-password-split-screen";
import { PageFrame } from "@/components/layout/page-frame";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";

export default async function ResetPasswordPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "auth.reset" });

  if (!isSupabaseConfigured()) {
    return (
      <PageFrame className="py-12 sm:py-14 lg:py-20">
        <SetupAlert description={t("setupDescription")} />
      </PageFrame>
    );
  }

  return <ResetPasswordSplitScreen locale={params.locale} />;
}
