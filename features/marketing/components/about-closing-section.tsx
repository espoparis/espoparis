type ClosingItem = {
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: ClosingItem[];
};

export function AboutClosingSection({
  eyebrow,
  title,
  description,
  items,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-16">
        <div className="public-intro-stack">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display max-w-xl">
            {title}
          </h2>
          <p className="public-copy-lead max-w-xl">
            {description}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60">
          {items.map((item) => (
            <div key={item.title} className="bg-background/76 p-6 backdrop-blur-xl sm:p-7">
              <h3 className="public-card-heading">
                {item.title}
              </h3>
              <p className="public-card-copy mt-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
