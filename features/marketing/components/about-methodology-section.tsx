type Channel = {
  title: string;
  description: string;
  languages: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  languagesLabel: string;
  channels: Channel[];
};

export function AboutMethodologySection({
  eyebrow,
  title,
  description,
  languagesLabel,
  channels,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16">
          <div className="public-intro-stack max-w-lg">
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="public-heading-display max-w-[12ch]">{title}</h2>
            <p className="public-copy-lead max-w-[30rem]">{description}</p>
          </div>

          <div className="grid gap-px self-start overflow-hidden rounded-sm border border-border/65 bg-border/60 sm:grid-cols-3">
            {channels.map((channel) => (
              <article
                key={channel.title}
                className="flex flex-col bg-background/80 p-6 sm:p-7"
              >
                <h3 className="public-item-title">{channel.title}</h3>
                <p className="public-card-copy">{channel.description}</p>
                <div className="mt-auto border-t border-border/60 pt-4">
                  <p className="section-eyebrow">{languagesLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {channel.languages}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
