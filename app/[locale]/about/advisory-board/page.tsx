import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GraduationCap } from "lucide-react";
import { getAboutContent } from "@/features/marketing/about-content";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const content = await getAboutContent(params.locale);
  return buildPageMetadata({ locale: params.locale, path: "/about/advisory-board", title: content.advisoryBoard.title, description: content.advisoryBoard.description });
}
export default async function AdvisoryBoardPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const content = await getAboutContent(params.locale);
  const board = content.advisoryBoard;
  return <main className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
    <header className="mx-auto max-w-4xl text-center"><p className="section-eyebrow">{board.eyebrow}</p><h1 className="mt-5 font-display text-[clamp(3rem,7vw,6rem)] font-medium leading-[.95] tracking-[-.05em]">{board.title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{board.description}</p></header>
    <section className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3 lg:mt-20">{board.members.map((member) => <article key={member.name} className="rounded-[2rem] border border-border/60 bg-card/80 p-6 shadow-[0_28px_80px_-60px_hsl(var(--foreground)/0.35)]"><GraduationCap className="size-7 text-primary"/><h2 className="mt-5 font-display text-2xl font-semibold">{member.name}</h2><p className="mt-2 text-sm font-semibold text-primary">{member.country}</p><ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">{member.credentials.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</section>
  </main>;
}
