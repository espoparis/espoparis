import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademicRecordCenter, type AcademicRecordCopy } from "@/features/student/components/academic-record-center";
import { getAuthSession } from "@/server/auth/session";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Page(props:{params: Promise<{locale:string}>}) {
  const params = await props.params;
  setRequestLocale(params.locale);const t=await getTranslations({locale:params.locale,namespace:"academicRecord"});const session=await getAuthSession();return <AcademicRecordCenter copy={t.raw("copy") as AcademicRecordCopy} session={session} locale={params.locale}/>;
}
