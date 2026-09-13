import { GraduationCap } from "lucide-react";

type Program = {
  title: string;
  description: string;
  audience: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  audienceLabel: string;
  programs: Program[];
};

export function RegisterProgramsSection({
  eyebrow,
  title,
  description,
  audienceLabel,
  programs,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[16ch]">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.title}
              className="flex flex-col border-t border-border p-6 sm:p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="public-card-heading mt-5">{program.title}</h3>
              <p className="public-card-copy">{program.description}</p>
              <div className="mt-6 border-t border-border/60 pt-4">
                <p className="section-eyebrow">{audienceLabel}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {program.audience}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
