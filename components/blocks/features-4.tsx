import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from "lucide-react";

type FeatureItem = {
  title: string;
  description: string;
};

type FeaturesProps = {
  title: string;
  description: string;
  items: FeatureItem[];
};

const icons = [Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles];

export function Features({ title, description, items }: FeaturesProps) {
  return (
    <section className="py-6 md:py-8">
      <div className="w-full space-y-5 md:space-y-8">
        <div className="relative z-10 mx-auto max-w-3xl space-y-5 text-center md:space-y-8">
          <h2 className="text-balance font-display text-[clamp(2.35rem,5.5vw,3.5rem)] font-medium text-foreground">
            {title}
          </h2>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        <div className="relative grid w-full divide-x divide-y border border-border/70 *:p-8 md:*:p-10 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <div key={item.title} className={index === 0 ? "space-y-3" : "space-y-2"}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" />
                  <h3 className="text-base font-medium text-foreground sm:text-lg">{item.title}</h3>
                </div>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
