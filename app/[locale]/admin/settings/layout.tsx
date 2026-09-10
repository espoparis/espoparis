import { notFound } from "next/navigation";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { getAuthSession } from "@/server/auth/session";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!canOpenAdminSection(session, "site-settings").allowed) notFound();
  return children;
}
