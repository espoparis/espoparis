"use client";

import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { AuthFormSplitScreen, type FormValues } from "@/components/ui/login";
import { loginAction, type ActionState } from "@/features/auth/actions";

const initialState: ActionState = {};

export function LoginSplitScreen({ locale }: { locale: string }) {
  const tLogin = useTranslations("auth.login");
  const tForm = useTranslations("auth.forms.login");
  const tCommon = useTranslations("common.actions");
  const [state, formAction] = useFormState(loginAction, initialState);

  const handleSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.set("locale", locale);
    formData.set("email", data.email);
    formData.set("password", data.password);
    await formAction(formData);
  };

  return (
    <AuthFormSplitScreen
      locale={locale}
      eyebrow={tLogin("eyebrow")}
      title={tLogin("title")}
      description={tLogin("description")}
      onSubmit={handleSubmit}
      forgotPasswordHref="/auth/forgot-password"
      createAccountHref="/auth/register"
      submitLabel={tForm("submit")}
      pendingLabel={tForm("pending")}
      emailLabel={tForm("email")}
      passwordLabel={tForm("password")}
      emailPlaceholder={tForm("placeholderEmail")}
      passwordPlaceholder={tForm("placeholderPassword")}
      rememberMeLabel={tForm("rememberMe")}
      forgotPasswordLabel={tCommon("forgotPassword")}
      noAccountText={tForm("noAccount")}
      createAccountText={tCommon("createAccount")}
      error={state.error}
      visualEyebrow={tLogin("eyebrow")}
      visualTitle={tLogin("visualTitle")}
      visualDescription={tLogin("visualDescription")}
    />
  );
}
