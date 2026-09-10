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

  return children;
}
