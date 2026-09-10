import { notFound, redirect } from "next/navigation";
import { localizePath } from "@/lib/constants/app";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { getAuthSession } from "@/server/auth/session";

export default async function AcademicAdminLayout(
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
  const decision = canOpenAdminSection(session, "academic");

  if (!decision.allowed && decision.reason === "sign-in-required") {
    redirect(localizePath(params.locale, "/sign-in"));
  }

  if (!decision.allowed) notFound();
  return children;
}
