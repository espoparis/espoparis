import { ActivityArticle } from "./activity-article";
import { CalendarDays, ImageIcon, Newspaper, Search } from "lucide-react";
import type { CmsItem } from "@/server/content/cms";

export type ActivitiesCopy = {
  eyebrow: string; title: string; description: string; emptyTitle: string; emptyDescription: string;
  capabilitiesTitle: string; capabilities: { title: string; description: string; icon: "news" | "events" | "gallery" | "search" }[];
};

const icons = { news: Newspaper, events: CalendarDays, gallery: ImageIcon, search: Search };

export function ActivitiesShell({ copy, items = [] }: { copy: ActivitiesCopy; items?: CmsItem[] }) {
  return <div className="page-shell pb-20 pt-12">
    <header className="max-w-4xl"><p className="section-eyebrow">{copy.eyebrow}</p><h1 className="public-heading-hero mt-5">{copy.title}</h1><p className="mt-6 public-copy-lead">{copy.description}</p></header>
    <section className="mt-12 grid items-start gap-x-12 md:grid-cols-2">
      {items.length ? items.map((item) => <ActivityArticle key={item.id} item={item}/>) : <div className="border-t border-border py-10"><h2 className="font-display text-2xl">{copy.emptyTitle}</h2><p className="mt-4 text-muted-foreground">{copy.emptyDescription}</p></div>}
    </section>
  </div>;
}
