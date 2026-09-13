import type { CmsItem } from "@/server/content/cms";
import { validImageReference } from "@/server/media/files";
export function ActivityArticle({ item, compact = false }: { item: CmsItem; compact?: boolean }) {
  return <article id={item.slug} className="scroll-mt-28 border-t border-border py-8">
    {item.coverImage && validImageReference(item.coverImage) ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.coverImage} alt={item.title} loading="lazy" className="mb-6 max-h-[36rem] w-full bg-secondary/30 object-contain" />
    ) : null}
    <h2 className="font-display text-2xl sm:text-3xl">{item.title}</h2>
    {item.excerpt ? <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">{item.excerpt}</p> : null}
    {!compact && item.body ? <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted-foreground">{item.body}</p> : null}
  </article>;
}
