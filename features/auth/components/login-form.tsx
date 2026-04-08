"use client";

import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { loginAction, type ActionState } from "@/features/auth/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("auth.forms.login");
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="form-stack">
      <input type="hidden" name="locale" value={locale} />
      <div className="field-stack">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required className="rounded-xl" />
      </div>
      <div className="field-stack">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" name="password" type="password" required className="rounded-xl" />
      </div>
      {state.error ? (
        <div className="inset-panel border-destructive/20 bg-destructive/5 text-sm leading-6 text-destructive">
          {state.error}
        </div>
      ) : null}
      <SubmitButton className="w-full" variant="hero" size="lg" pendingLabel={t("pending")}>
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
