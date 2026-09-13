import { ShieldCheck } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  objectives: string[];
  focusLabel: string;
  focusAreas: string[];
  noteTitle: string;
  noteDescription: string;
};

export function AboutObjectivesSection({
  eyebrow,
  title,
  description,
  objectives,
  focusLabel,
  focusAreas,
  noteTitle,
  noteDescription,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[15ch]">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <ul className="grid gap-3">
            {objectives.map((objective) => (
              <li
                key={objective}
                className="flex gap-4 border-t border-border px-5 py-5 text-sm leading-7 text-muted-foreground md:text-[0.98rem]"
              >
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-sm bg-primary/85" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border p-6 sm:p-7">
            <p className="section-eyebrow">{focusLabel}</p>
            <ul className="mt-5 space-y-3">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="border-t border-border px-4 py-3 text-sm leading-6 text-foreground"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary"
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="public-item-title">{noteTitle}</h3>
            <p className="public-card-copy mt-0">{noteDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
