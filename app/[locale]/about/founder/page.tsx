import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AboutFounderSection } from "@/features/marketing/components/about-founder-section";
import { getAboutContent } from "@/features/marketing/about-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const content = await getAboutContent(params.locale);
  return buildPageMetadata({ locale: params.locale, path: "/about/founder", title: content.founder.name, description: content.founder.description });
}

export default async function FounderPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const content = await getAboutContent(params.locale);
  return <main className="page-shell pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-36"><AboutFounderSection {...content.founder} /></main>;
}
