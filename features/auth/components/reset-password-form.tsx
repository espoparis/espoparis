"use client";

import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { resetPasswordAction, type ActionState } from "@/features/auth/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function ResetPasswordForm({ locale }: { locale: string }) {
  const t = useTranslations("auth.forms.reset");
  const [state, formAction] = useFormState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          size="lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          size="lg"
        />
      </div>
      {state.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
          {state.error}
        </div>
      ) : null}
      <SubmitButton className="w-full" variant="hero" size="lg" pendingLabel={t("pending")}>
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
