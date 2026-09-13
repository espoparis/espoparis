type ProgramTrack = {
  title: string;
  description: string;
  points: readonly string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  weekendLabel: string;
  tracks: readonly ProgramTrack[];
  weekendSchool: ProgramTrack;
};

export function AboutProgramsSection({
  eyebrow,
  title,
  description,
  weekendLabel,
  tracks,
  weekendSchool,
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

        <div className="grid gap-5 lg:grid-cols-2">
          {tracks.map((track) => (
            <article
              key={track.title}
              className="border-t border-border p-6 sm:p-7"
            >
              <h3 className="public-card-heading">
                {track.title}
              </h3>
              <p className="public-card-copy mt-3">
                {track.description}
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
                {track.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-primary/85" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className="border-t border-border p-6 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)] lg:gap-10">
            <div className="public-intro-stack max-w-md">
              <p className="section-eyebrow">{weekendLabel}</p>
              <h3 className="public-card-heading text-balance">
                {weekendSchool.title}
              </h3>
              <p className="public-card-copy">
                {weekendSchool.description}
              </p>
            </div>

            <ul className="grid gap-3 text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
              {weekendSchool.points.map((point) => (
                <li key={point} className="flex gap-3 border-t border-border px-4 py-4">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-primary/85" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
