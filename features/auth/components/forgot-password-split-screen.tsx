"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthSplitShell } from "@/components/ui/auth-split-shell";

export function ForgotPasswordSplitScreen({ locale }: { locale: string }) {
  const t = useTranslations("auth.forgot");
  const tCommon = useTranslations("common.actions");

  return (
    <AuthSplitShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      visualEyebrow={t("eyebrow")}
      visualTitle={t("visualTitle")}
      visualDescription={t("visualDescription")}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          <Link
            href="/auth/login"
            locale={locale}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            {tCommon("backToSignIn")}
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm locale={locale} />
    </AuthSplitShell>
  );
}
