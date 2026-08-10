type Step = {
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  steps: Step[];
};

export function RegisterStepsSection({
  eyebrow,
  title,
  description,
  steps,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
        <div className="public-intro-stack max-w-lg">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display max-w-[13ch]">{title}</h2>
          <p className="public-copy-lead max-w-[30rem]">{description}</p>
        </div>

        <ol className="grid gap-px self-start overflow-hidden rounded-[2rem] border border-border/65 bg-border/60">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-background/78 p-6 backdrop-blur-xl sm:p-7">
              <p className="section-eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="public-card-heading mt-3">{step.title}</h3>
              <p className="public-card-copy">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
