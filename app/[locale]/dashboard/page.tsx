import { redirect } from "next/navigation";
import { getSessionContext } from "@/server/auth/session";
import { localizePath } from "@/lib/constants/app";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const { profile } = await getSessionContext();

  if (!profile) {
    redirect(localizePath(params.locale, "/auth/login"));
  }

  if (profile.approvalStatus !== "approved") {
    redirect(localizePath(params.locale, "/pending"));
  }

  redirect(localizePath(params.locale, `/${profile.role}`));
}
