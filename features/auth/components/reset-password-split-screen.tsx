"use client";

import { useTranslations } from "next-intl";
import { AuthSplitShell } from "@/components/ui/auth-split-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export function ResetPasswordSplitScreen({ locale }: { locale: string }) {
  const t = useTranslations("auth.reset");

  return (
    <AuthSplitShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      visualEyebrow={t("eyebrow")}
      visualTitle={t("visualTitle")}
      visualDescription={t("visualDescription")}
    >
      <ResetPasswordForm locale={locale} />
    </AuthSplitShell>
  );
}
