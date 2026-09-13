import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { getAboutContent } from "@/features/marketing/about-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const content = await getAboutContent(params.locale);
  return buildPageMetadata({ locale: params.locale, path: "/global-presence", title: content.network.title, description: content.network.description });
}
export default async function GlobalPresencePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const content = await getAboutContent(params.locale);
  const network = content.network;
  return <div className="page-shell pb-24 pt-12 sm:pt-16 lg:pb-32 lg:pt-20">
    <header className="mx-auto max-w-4xl text-center"><p className="section-eyebrow">{network.eyebrow}</p><h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[.95] tracking-[-.05em]">{network.title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{network.description}</p></header>
    <section className="mx-auto mt-14 grid max-w-6xl gap-x-12 gap-y-8 md:grid-cols-2 lg:mt-20">{network.institutes.map((item) => <article key={`${item.country}-${item.institute}`} className="border-t border-border py-7"><div className="flex items-center gap-3"><span className="flex shrink-0 items-center justify-center"><MapPin className="size-5 text-primary"/></span><div><p className="text-sm font-semibold text-primary">{item.country}</p><h2 className="font-display text-2xl font-semibold">{item.institute}</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</section>
    <p className="mx-auto mt-10 max-w-4xl border-t border-border pt-6 text-center text-sm leading-7 text-muted-foreground">{network.note}</p>
  </div>;
}
