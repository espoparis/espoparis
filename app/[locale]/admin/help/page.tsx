import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/navigation";
export default async function Page(props:{params:Promise<{locale:string}>}) {
  const {locale}=await props.params;setRequestLocale(locale);const t=await getTranslations("adminOperations");
  const sections=[{key:"contentGuide",title:"newItem",href:"/admin/content"},{key:"libraryGuide",title:"libraryTitle",href:"/admin/library"},{key:"reflectionGuide",title:"newReflection",href:"/admin/content"},{key:"profileGuide",title:"profiles",href:"/admin/content/profiles"}];
  return <div className="page-shell max-w-5xl py-12"><h1 className="font-display text-4xl">{t("help")}</h1><p className="mt-5 text-muted-foreground">{t("helpIntro")}</p><div className="mt-10 divide-y divide-border">{sections.map(s=><section key={s.key} className="py-7"><h2 className="font-display text-2xl"><Link href={s.href} className="underline underline-offset-4">{t(s.title)}</Link></h2><p className="mt-4 leading-8">{t(s.key)}</p></section>)}</div><p className="border-s-2 border-primary bg-secondary p-5 leading-8">{t("statusGuide")}</p></div>;
}
