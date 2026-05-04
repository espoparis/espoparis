type PeopleGroup = {
  title: string;
  members: readonly string[];
};

type Founder = {
  title: string;
  paragraphs: readonly string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  founder: Founder;
  advisoryBoard: PeopleGroup;
  faculty: PeopleGroup;
};

export function AboutScholarsSection({
  eyebrow,
  title,
  description,
  founder,
  advisoryBoard,
  faculty,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-14">
          <div className="public-intro-stack">
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="public-heading-display max-w-xl">
              {title}
            </h2>
            <p className="public-copy-lead max-w-xl">
              {description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/65 bg-card/78 p-6 shadow-[0_36px_90px_-64px_hsl(var(--foreground)/0.38)] backdrop-blur-xl sm:p-7">
            <h3 className="public-card-heading">
              {founder.title}
            </h3>
            <div className="mt-4 space-y-4">
              {founder.paragraphs.map((paragraph) => (
                <p key={paragraph} className="public-card-copy">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[advisoryBoard, faculty].map((group) => (
            <article
              key={group.title}
              className="rounded-[2rem] border border-border/65 bg-background/72 p-6 shadow-[0_30px_80px_-56px_hsl(var(--foreground)/0.28)] backdrop-blur-xl sm:p-7"
            >
              <h3 className="public-card-heading">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
                {group.members.map((member) => (
                  <li
                    key={member}
                    className="rounded-2xl border border-border/55 bg-background/70 px-4 py-4"
                  >
                    {member}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
