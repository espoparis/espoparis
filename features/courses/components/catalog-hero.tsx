import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  badge: string;
  title: string;
  description: string;
  focusEyebrow: string;
  focusDescription: string;
  surfaceOne: string;
  surfaceTwo: string;
};

export function CatalogHero({
  badge,
  title,
  description,
  focusEyebrow,
  focusDescription,
  surfaceOne,
  surfaceTwo,
}: Props) {
  return (
    <section className="full-bleed border-b border-border/60 bg-background">
      <div className="page-shell pb-12 pt-8 sm:pb-14 lg:pb-16 lg:pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.76fr)] lg:items-end lg:gap-12">
          <div className="content-cluster">
            <Badge variant="secondary" className="w-fit gap-2 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              {badge}
            </Badge>
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60 shadow-[0_28px_90px_-54px_hsl(var(--foreground)/0.22)]">
            <div className="bg-background/76 p-6 backdrop-blur-xl sm:p-7">
              <p className="section-eyebrow">{focusEyebrow}</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                {focusDescription}
              </p>
            </div>
            <div className="grid gap-px sm:grid-cols-2">
              <div className="bg-background/76 p-6 backdrop-blur-xl sm:p-7">
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {surfaceOne}
                </p>
              </div>
              <div className="bg-background/76 p-6 backdrop-blur-xl sm:p-7">
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {surfaceTwo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
