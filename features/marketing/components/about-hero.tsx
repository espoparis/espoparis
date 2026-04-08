import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

type HeroPanelItem = {
  title: string;
  description: string;
};

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  panelEyebrow: string;
  panelTitle: string;
  panelDescription: string;
  items: HeroPanelItem[];
};

export function AboutHero({
  locale,
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  panelEyebrow,
  panelTitle,
  panelDescription,
  items,
}: Props) {
  return (
    <section className="full-bleed border-b border-border/60 bg-background">
      <div className="page-shell pb-14 pt-12 lg:pb-16 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.78fr)] lg:items-end lg:gap-12">
          <div className="content-cluster">
            <p className="section-eyebrow">{eyebrow}</p>
            <div className="max-w-4xl space-y-4">
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link href="/courses" locale={locale}>
                  {primaryCta}
                </Link>
              </Button>
              <Button asChild variant="nav" size="lg">
                <Link href="/auth/register" locale={locale}>
                  {secondaryCta}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border/65 bg-border/60 shadow-[0_28px_90px_-54px_hsl(var(--foreground)/0.22)]">
            <div className="bg-background/76 p-6 backdrop-blur-xl sm:p-7">
              <p className="section-eyebrow">{panelEyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
                {panelTitle}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                {panelDescription}
              </p>
            </div>

            {items.map((item) => (
              <div
                key={item.title}
                className="bg-background/76 p-6 backdrop-blur-xl sm:p-7"
              >
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
