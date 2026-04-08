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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12">
        <div className="space-y-4">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="max-w-xl font-display text-[clamp(2.25rem,4.8vw,3.4rem)] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60">
          {items.map((item) => (
            <div key={item.title} className="bg-background/76 p-6 backdrop-blur-xl sm:p-7">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
