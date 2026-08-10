export type Institute = {
  country: string;
  institute: string;
  details: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  institutes: Institute[];
  note: string;
};

export function AboutNetworkSection({
  eyebrow,
  title,
  description,
  institutes,
  note,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[14ch]">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {institutes.map((item, index) => (
            <article
              key={`${item.country}-${item.institute}`}
              className="flex flex-col rounded-[2rem] border border-border/65 bg-background/74 p-6 shadow-[0_30px_80px_-56px_hsl(var(--foreground)/0.28)] backdrop-blur-xl sm:p-7"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="public-card-heading">{item.country}</h3>
                <p className="section-eyebrow">{String(index + 1).padStart(2, "0")}</p>
              </div>
              <p className="mt-2 text-base font-medium text-primary sm:text-lg">
                {item.institute}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
                {item.details.map((detail) => (
                  <li key={detail} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/85" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="rounded-[2rem] border border-border/65 bg-card/76 px-6 py-5 text-center shadow-[0_34px_90px_-60px_hsl(var(--foreground)/0.34)] backdrop-blur-xl sm:px-7">
          <p className="public-copy-lead mx-auto max-w-3xl text-balance text-base md:text-[1.02rem]">
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
