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
      <div className="public-section-stack w-full">
        <div className="public-intro-stack relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="public-heading-display">{title}</h2>
          <p className="public-copy-lead">{description}</p>
        </div>

        <div className="relative grid w-full divide-x divide-y border border-border/70 *:p-8 md:*:p-10 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <div key={item.title} className={index === 0 ? "space-y-3" : "space-y-2"}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" />
                  <h3 className="public-item-title">{item.title}</h3>
                </div>
                <p className="public-item-copy">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
