import { getTranslations } from "next-intl/server";
import { ForgotPasswordSplitScreen } from "@/features/auth/components/forgot-password-split-screen";
import { PageFrame } from "@/components/layout/page-frame";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";

export default async function ForgotPasswordPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "auth.forgot" });

  if (!isSupabaseConfigured()) {
    return (
      <PageFrame className="py-12 sm:py-14 lg:py-20">
        <SetupAlert description={t("setupDescription")} />
      </PageFrame>
    );
  }

  return <ForgotPasswordSplitScreen locale={params.locale} />;
}
