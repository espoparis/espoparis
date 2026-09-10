import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnrollmentIntegrityCenter, type EnrollmentIntegrityCopy } from "@/features/admin/components/enrollment-integrity-center";
import { getAuthSession } from "@/server/auth/session";
export default async function Page(props:{params: Promise<{locale:string}>}) {
  const params = await props.params;
  setRequestLocale(params.locale);const t=await getTranslations({locale:params.locale,namespace:"enrollmentIntegrity"});const session=await getAuthSession();return <EnrollmentIntegrityCenter copy={t.raw("copy") as EnrollmentIntegrityCopy} session={session}/>;
}
