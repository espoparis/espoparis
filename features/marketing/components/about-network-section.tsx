type Institute = {
  country: string;
  institute: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  institutes: readonly Institute[];
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
        <div className="mx-auto max-w-3xl text-center public-intro-stack">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[14ch]">
            {title}
          </h2>
          <p className="public-copy-lead mx-auto max-w-2xl">
            {description}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {institutes.map((item, index) => (
            <article
              key={`${item.country}-${item.institute}`}
              className="rounded-[2rem] border border-border/65 bg-background/74 p-6 shadow-[0_30px_80px_-56px_hsl(var(--foreground)/0.28)] backdrop-blur-xl sm:p-7"
            >
              <p className="section-eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="public-card-heading mt-3">
                {item.country}
              </h3>
              <p className="public-card-copy mt-3">
                {item.institute}
              </p>
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
