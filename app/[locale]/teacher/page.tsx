import { getTranslations } from "next-intl/server";
import { TeacherGradebookShell, type TeacherPortalCopy } from "@/features/teacher/components/teacher-gradebook-shell";
import { getAuthSession } from "@/server/auth/session";

export default async function TeacherPortalPage() {
  const t = await getTranslations("teacherPortal");
  const session = await getAuthSession();
  return <TeacherGradebookShell copy={t.raw("content") as TeacherPortalCopy} session={session} />;
}
