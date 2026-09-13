import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { localizePath } from "@/lib/constants/app";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { getAuthSession } from "@/server/auth/session";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const session = await getAuthSession();
  const decision = canOpenAdminSection(session, "root");

  if (!decision.allowed && decision.reason === "sign-in-required") {
    redirect(localizePath(params.locale, "/sign-in"));
  }

  if (!decision.allowed) {
    // Conceal the existence of internal administration routes from authenticated
    // accounts that do not have a staff administration role.
    notFound();
  }

  const t = await getTranslations({locale:params.locale,namespace:"adminOperations"});
  return <>
    <nav className="page-shell flex flex-wrap gap-x-6 gap-y-3 border-b border-border py-5 text-sm">
      <Link href="/admin">{(await getTranslations({locale:params.locale,namespace:"adminDashboard"}))("title")}</Link>
      {canOpenAdminSection(session,"content").allowed ? <><Link href="/admin/content">{t("newItem")}</Link><Link href="/admin/content/profiles">{t("profiles")}</Link></> : null}
      <Link href="/admin/help">{t("help")}</Link>
    </nav>
    {children}
  </>;
}
