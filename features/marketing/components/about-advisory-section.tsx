export type AdvisoryMember = {
  name: string;
  country: string;
  credentials: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  members: AdvisoryMember[];
};

export function AboutAdvisorySection({
  eyebrow,
  title,
  description,
  members,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:items-start lg:gap-16">
          <div className="public-intro-stack max-w-lg">
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="public-heading-display max-w-[13ch]">{title}</h2>
            <p className="public-copy-lead max-w-[31rem]">{description}</p>
          </div>

          <div className="grid gap-5">
            {members.map((member) => (
              <article
                key={member.name}
                className="rounded-[2rem] border border-border/65 bg-background/74 p-6 shadow-[0_30px_80px_-56px_hsl(var(--foreground)/0.28)] backdrop-blur-xl sm:p-7"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold leading-7 text-foreground">
                    {member.name}
                  </h3>
                  <p className="section-eyebrow">{member.country}</p>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
                  {member.credentials.map((credential) => (
                    <li key={credential} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/85" />
                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
