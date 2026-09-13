import Image from "next/image";
import { FOUNDER_IMAGE } from "@/features/marketing/faculty-images";

type Fact = {
  label: string;
  value: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  name: string;
  role: string;
  photoAlt: string;
  paragraphs: string[];
  factsLabel: string;
  facts: Fact[];
};

export function AboutFounderSection({
  eyebrow,
  title,
  description,
  name,
  role,
  photoAlt,
  paragraphs,
  factsLabel,
  facts,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[15ch]">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-28">
            {/* Capped below `lg`: at tablet width the 3:4 portrait otherwise
                fills a whole viewport height before any text is reached. */}
            <figure className="mx-auto max-w-sm overflow-hidden border-t border-border lg:max-w-none">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={FOUNDER_IMAGE}
                  alt={photoAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="editorial-portrait object-cover object-top"
                  priority
                />
              </div>
              <figcaption className="space-y-1 p-5 sm:p-6">
                <p className="text-lg font-semibold leading-7 text-foreground">{name}</p>
                <p className="public-support-text">{role}</p>
              </figcaption>
            </figure>
          </div>

          <div className="space-y-8">
            <div className="border-t border-border p-6 sm:p-8">
              <div className="space-y-5">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="public-card-copy mt-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-6 sm:p-8">
              <p className="section-eyebrow">{factsLabel}</p>
              <dl className="mt-5 grid gap-px overflow-hidden rounded-sm border border-border/60 bg-border/60 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-background/85 p-5">
                    <dt className="text-sm font-medium uppercase tracking-[0.18em] text-primary/90">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
