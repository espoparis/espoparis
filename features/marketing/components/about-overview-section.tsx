type OverviewCard = {
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly OverviewCard[];
};

export function AboutOverviewSection({
  eyebrow,
  title,
  description,
  cards,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)] lg:items-start lg:gap-16">
          <div className="public-intro-stack max-w-lg">
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="public-heading-display max-w-[11ch]">
              {title}
            </h2>
            <p className="public-copy-lead max-w-[30rem]">
              {description}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60 self-start sm:grid-cols-2">
            {cards.map((card) => (
              <article
                key={card.title}
                className="bg-background/78 p-6 backdrop-blur-xl sm:p-7"
              >
                <h3 className="public-card-heading">
                  {card.title}
                </h3>
                <p className="public-card-copy mt-3">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
