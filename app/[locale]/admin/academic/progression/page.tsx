import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProgressionCenter, type ProgressionCopy } from "@/features/admin/components/progression-center";
import { getAuthSession } from "@/server/auth/session";
export default async function Page(props:{params: Promise<{locale:string}>}) {
  const params = await props.params;
  setRequestLocale(params.locale);const t=await getTranslations({locale:params.locale,namespace:"progressionCenter"});const session=await getAuthSession();return <ProgressionCenter copy={t.raw("copy") as ProgressionCopy} session={session}/>;
}
