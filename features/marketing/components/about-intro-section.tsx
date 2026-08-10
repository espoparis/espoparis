type Props = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  pullQuote: string;
};

export function AboutIntroSection({
  eyebrow,
  title,
  paragraphs,
  pullQuote,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-16">
        <div className="public-intro-stack max-w-lg">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display max-w-[13ch]">{title}</h2>
          <div className="surface-accent p-6 sm:p-7">
            <p className="text-base leading-8 text-foreground sm:text-lg">{pullQuote}</p>
          </div>
        </div>

        <div className="space-y-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="public-copy-lead">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
