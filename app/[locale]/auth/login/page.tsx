import { getTranslations } from "next-intl/server";
import { PageFrame } from "@/components/layout/page-frame";
import { SetupAlert } from "@/components/shared/setup-alert";
import { LoginSplitScreen } from "@/features/auth/components/login-split-screen";
import { isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "auth.login" });
  if (!isSupabaseConfigured()) {
    return (
      <PageFrame className="py-12 sm:py-14 lg:py-20">
        <SetupAlert description={t("setupDescription")} />
      </PageFrame>
    );
  }

  return <LoginSplitScreen locale={params.locale} />;
}
