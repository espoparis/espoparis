import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAuthSession } from "@/server/auth/session";
import { getCmsAdminSnapshot } from "@/server/content/cms-repository";
import { canCms } from "@/server/content/cms";
import type { FacultyProfile } from "@/server/content/faculty-profile";
import type { FacultyMember } from "@/features/marketing/components/about-faculty-section";
import { FacultyProfileEditor } from "@/features/admin/components/faculty-profile-editor";
export default async function Page(props:{params:Promise<{locale:string}>}) {
  const {locale}=await props.params;setRequestLocale(locale);
  const t=await getTranslations("adminOperations"), faculty=await getTranslations("about.content.faculty");
  const session=await getAuthSession();
  const snapshot=session.identity ? await getCmsAdminSnapshot(session.identity) : null;
  const role=session.identity?.role ?? "visitor";
  return <><header className="page-shell py-10"><h1 className="font-display text-4xl">{t("profiles")}</h1></header><FacultyProfileEditor locale={locale as FacultyProfile["locale"]} members={faculty.raw("members") as FacultyMember[]} profiles={snapshot?.profiles ?? []} connected={snapshot?.state==="connected"} canPublish={canCms(role,"content.publish")} canEdit={canCms(role,"content.edit")}/></>;
}
