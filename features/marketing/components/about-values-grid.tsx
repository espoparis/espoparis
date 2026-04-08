import { BookOpen, HeartHandshake, ShieldCheck, Sparkles, Users2, Waypoints } from "lucide-react";

type ValueItem = {
  title: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: ValueItem[];
};

const icons = [HeartHandshake, BookOpen, ShieldCheck, Sparkles, Users2, Waypoints];

export function AboutValuesGrid({ eyebrow, title, description, items }: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="w-full space-y-6 md:space-y-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.4rem)] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <div key={item.title} className="bg-background/76 p-7 backdrop-blur-xl sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
