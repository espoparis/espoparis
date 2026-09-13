import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FacultyDirectory } from "@/features/marketing/components/faculty-directory";
import { getAboutContent } from "@/features/marketing/about-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const content = await getAboutContent(params.locale);
  return buildPageMetadata({ locale: params.locale, path: "/faculty", title: content.faculty.title, description: content.faculty.description });
}

export default async function FacultyPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const content = await getAboutContent(params.locale);
  return <div className="page-shell pb-24 pt-12 sm:pt-16 lg:pb-32 lg:pt-20">
    <header className="mx-auto max-w-4xl text-center">
      <p className="section-eyebrow">{content.faculty.eyebrow}</p>
      <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[1.1] tracking-[-.025em]">{content.faculty.title}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{content.faculty.description}</p>
    </header>
    <section className="mt-14 lg:mt-20"><FacultyDirectory members={content.faculty.members} languagesLabel={content.faculty.languagesLabel} worksLabel={content.faculty.worksLabel} photoAltTemplate={content.faculty.photoAltTemplate} /></section>
  </div>;
}
