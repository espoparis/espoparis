import { Languages, Compass } from "lucide-react";

export type Distinctive = {
  title: string;
  description: string;
  points: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: Distinctive[];
};

const icons = [Languages, Compass];

export function AboutDistinctivesSection({
  eyebrow,
  title,
  description,
  items,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[15ch]">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((item, index) => {
            const Icon = icons[index] ?? Compass;

            return (
              <article
                key={item.title}
                className="border-t border-border p-6 sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="public-card-heading mt-5">{item.title}</h3>
                <p className="public-card-copy">{item.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="border-t border-border px-4 py-2 text-sm text-muted-foreground"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
