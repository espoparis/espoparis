import { getTranslations } from "next-intl/server";
import { RegisterSplitScreen } from "@/features/auth/components/register-split-screen";
import { PageFrame } from "@/components/layout/page-frame";
import { SetupAlert } from "@/components/shared/setup-alert";
import { isSupabaseConfigured } from "@/lib/env";

export default async function RegisterPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "auth.register" });

  if (!isSupabaseConfigured()) {
    return (
      <PageFrame className="py-12 sm:py-14 lg:py-20">
        <SetupAlert description={t("setupDescription")} />
      </PageFrame>
    );
  }

  return <RegisterSplitScreen locale={params.locale} />;
}
