"use client";

import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { forgotPasswordAction, type ActionState } from "@/features/auth/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const t = useTranslations("auth.forms.forgot");
  const [state, formAction] = useFormState(forgotPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          size="lg"
        />
      </div>
      {state.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-primary">
          {state.success}
        </div>
      ) : null}
      <SubmitButton className="w-full" variant="hero" size="lg" pendingLabel={t("pending")}>
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
