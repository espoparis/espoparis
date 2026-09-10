import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignInShell } from "@/features/auth/components/sign-in-shell";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthProviderReadiness } from "@/server/auth/providers";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "signIn" });
  return buildPageMetadata({ locale: params.locale, path: "/sign-in", title: t("title"), description: t("description") });
}

export default async function SignInPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "signIn" });
  return <SignInShell copy={t.raw("copy")} readiness={getAuthProviderReadiness()} locale={params.locale} />;
}
