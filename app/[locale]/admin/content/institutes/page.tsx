import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAuthSession } from "@/server/auth/session";
import { getCmsAdminSnapshot } from "@/server/content/cms-repository";
import { canCms } from "@/server/content/cms";
import type { InstituteRecord } from "@/server/content/institute";
import { InstituteEditor } from "@/features/admin/components/institute-editor";
export default async function Page({params}: {params: Promise<{locale:string}>}) {
  const {locale} = await params;setRequestLocale(locale);
  const t = await getTranslations("adminInstitutes");
  const session = await getAuthSession(), role = session.identity?.role ?? "visitor";
  const snapshot = session.identity ? await getCmsAdminSnapshot(session.identity) : null;
  return <><header className="page-shell py-10"><h1 className="font-display text-4xl">{t("title")}</h1></header><InstituteEditor locale={locale as InstituteRecord["locale"]} items={snapshot?.institutes ?? []} connected={snapshot?.state === "connected"} canEdit={canCms(role,"content.edit")} canPublish={canCms(role,"content.publish")} canDelete={canCms(role,"content.delete")}/></>;
}
