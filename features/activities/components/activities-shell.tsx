import { CalendarDays, ImageIcon, Newspaper, Search } from "lucide-react";
import type { CmsItem } from "@/server/content/cms";

export type ActivitiesCopy = {
  eyebrow: string; title: string; description: string; emptyTitle: string; emptyDescription: string;
  capabilitiesTitle: string; capabilities: { title: string; description: string; icon: "news" | "events" | "gallery" | "search" }[];
};

const icons = { news: Newspaper, events: CalendarDays, gallery: ImageIcon, search: Search };

export function ActivitiesShell({ copy, items = [] }: { copy: ActivitiesCopy; items?: CmsItem[] }) {
  return <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
    <header className="mx-auto max-w-4xl text-center"><p className="section-eyebrow">{copy.eyebrow}</p><h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[.94] tracking-[-.055em]">{copy.title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p></header>
    <section className="mx-auto mt-12 max-w-6xl">
      {items.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item)=><article key={item.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-primary">{item.kind}</span>{item.schedule?.publishAt ? <span className="text-xs text-muted-foreground">{new Date(item.schedule.publishAt).toLocaleDateString()}</span> : null}</div><h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">{item.title}</h2>{item.excerpt ? <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.excerpt}</p> : null}</article>)}</div> : <div className="rounded-[2rem] border border-dashed border-border bg-secondary/20 p-10 text-center sm:p-14"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Newspaper className="size-6" /></div><h2 className="mt-5 font-display text-2xl font-semibold">{copy.emptyTitle}</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{copy.emptyDescription}</p></div>}
      <div className="mt-6 rounded-[2rem] bg-[#082e24] p-7 text-white sm:p-9"><h2 className="font-display text-3xl font-semibold">{copy.capabilitiesTitle}</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{copy.capabilities.map((item)=>{const Icon=icons[item.icon];return <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[.055] p-5"><Icon className="size-5 text-[#e2c27b]"/><h3 className="mt-3 font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p></article>})}</div></div>
    </section>
  </div>;
}
