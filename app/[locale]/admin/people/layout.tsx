import { notFound } from "next/navigation";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { getAuthSession } from "@/server/auth/session";

export default async function PeopleLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!canOpenAdminSection(session, "permissions").allowed) notFound();
  return children;
}
