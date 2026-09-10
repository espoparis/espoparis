import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademicProgramGuide, type AcademicProgramCopy } from "@/features/marketing/components/academic-program-guide";
import { buildPageMetadata } from "@/lib/seo";
export async function generateMetadata(props:{params: Promise<{locale:string}>}):Promise<Metadata> {
  const params = await props.params;
  const t=await getTranslations({locale:params.locale,namespace:"academicProgram"});return buildPageMetadata({locale:params.locale,path:"/academic-program",title:t("title"),description:t("description")});
}
export default async function Page(props:{params: Promise<{locale:string}>}) {
  const params = await props.params;
  setRequestLocale(params.locale);const t=await getTranslations({locale:params.locale,namespace:"academicProgram"});return <AcademicProgramGuide copy={t.raw("copy") as AcademicProgramCopy}/>
}
