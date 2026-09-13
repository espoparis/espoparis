type Props = {
  eyebrow: string;
  title: string;
  description: string;
  addressLabel: string;
  addressLines: string[];
  hoursLabel: string;
  hoursLines: string[];
  noteLabel: string;
  noteDescription: string;
};

export function ContactVisitSection({
  eyebrow,
  title,
  description,
  addressLabel,
  addressLines,
  hoursLabel,
  hoursLines,
  noteLabel,
  noteDescription,
}: Props) {
  return (
    <section id="visit-academy" className="py-6 md:py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
        <div className="public-intro-stack">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display max-w-xl">
            {title}
          </h2>
          <p className="public-copy-lead max-w-xl">
            {description}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-border/65 bg-border/60">
          <div className="bg-background/82 p-6 sm:p-7">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/90">
              {addressLabel}
            </p>
            <div className="mt-4 space-y-1.5 text-base leading-7 text-foreground sm:text-lg">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="bg-background/82 p-6 sm:p-7">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/90">
              {hoursLabel}
            </p>
            <div className="mt-4 space-y-1.5 text-base leading-7 text-foreground sm:text-lg">
              {hoursLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="bg-background/82 p-6 sm:p-7">
            <p className="public-card-heading">
              {noteLabel}
            </p>
            <p className="public-card-copy">
              {noteDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
