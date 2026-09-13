import { ActivityArticle } from "@/features/activities/components/activity-article";
import type { CmsItem } from "@/server/content/cms";
import type { ActivitiesCopy } from "@/features/activities/components/activities-shell";
import { Link } from "@/lib/navigation";
import { Reveal } from "@/components/motion/reveal";

export function HomeNewsSection({ locale, copy, items }: { locale: string; copy: ActivitiesCopy; items: CmsItem[] }) {
  return (
    <section className="page-shell editorial-section">
      <Reveal className="editorial-layout">
        <div>
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-4 public-heading-display">{copy.title}</h2>
          <p className="mt-6 editorial-copy">{copy.description}</p>
          <Link href="/activities" locale={locale} className="mt-8 inline-block border-b border-primary pb-2 text-sm font-semibold text-primary">{copy.title} <span aria-hidden="true">↗</span></Link>
        </div>
        <div>
          {items.length ? items.slice(0, 3).map((item) => (
            <ActivityArticle key={item.id} item={item} compact />
          )) : (
            <div className="editorial-row">
              <h3 className="font-display text-2xl">{copy.emptyTitle}</h3>
              <p className="mt-4 editorial-copy">{copy.emptyDescription}</p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
