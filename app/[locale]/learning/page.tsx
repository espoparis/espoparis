import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LearningShell } from "@/features/learning/components/learning-shell";
import { buildPageMetadata } from "@/lib/seo";
import { digitalLearningRepository } from "@/server/digital/repository";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "learning" });
  return buildPageMetadata({ locale: params.locale, path: "/learning", title: t("title"), description: t("description") });
}

export default async function LearningPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const [t, academic, lessons] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "learning" }),
    getTranslations({ locale: params.locale, namespace: "academicProgram" }),
    digitalLearningRepository.listPublishedLessons(),
  ]);
  return <LearningShell copy={t.raw("copy")} years={academic.raw("copy.years")} lessons={lessons} locale={params.locale} />;
}
