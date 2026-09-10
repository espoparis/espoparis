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
  return <main className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
    <header className="mx-auto max-w-4xl text-center"><p className="section-eyebrow">{network.eyebrow}</p><h1 className="mt-5 font-display text-[clamp(3rem,7vw,6rem)] font-medium leading-[.95] tracking-[-.05em]">{network.title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{network.description}</p></header>
    <section className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:mt-20">{network.institutes.map((item) => <article key={`${item.country}-${item.institute}`} className="rounded-[2rem] border border-border/60 bg-card/80 p-6"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-primary/10"><MapPin className="size-5 text-primary"/></span><div><p className="text-sm font-semibold text-primary">{item.country}</p><h2 className="font-display text-2xl font-semibold">{item.institute}</h2></div></div><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</section>
    <p className="mx-auto mt-10 max-w-4xl rounded-[1.6rem] border border-primary/15 bg-primary/5 p-6 text-center text-sm leading-7 text-muted-foreground">{network.note}</p>
  </main>;
}
