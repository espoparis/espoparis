import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NotificationCenterShell, type NotificationCenterCopy } from "@/features/operations/components/notification-center-shell";
import { buildPageMetadata } from "@/lib/seo";
import { getAuthSession } from "@/server/auth/session";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "notifications" });
  return {
    ...buildPageMetadata({ locale: params.locale, path: "/notifications", title: t("title"), description: t("description") }),
    robots: { index: false, follow: false },
  };
}

export default async function NotificationsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "notifications" });
  const session = await getAuthSession();
  return <NotificationCenterShell copy={t.raw("content") as NotificationCenterCopy} session={session} />;
}
