import { BookOpen, Quote, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type TeamMember = {
  name: string;
  role: string;
};

type TeamSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  members: TeamMember[];
  testimonial: {
    quote: string;
    name: string;
    role: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
};

/**
 * Faculty are presented as a typographic roster rather than a portrait wall.
 * These are named, living scholars, so the section deliberately carries no
 * photography until real, cleared images are supplied.
 */
export function TeamSection({
  eyebrow,
  title,
  description,
  members,
  testimonial,
  cta,
  className,
}: TeamSectionProps) {
  return (
    <section className={cn("relative full-bleed overflow-hidden py-16 md:py-24", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.035] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-border/70" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border/70" />

      <div className="page-shell relative z-10">
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center md:mb-20">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground hero-glow">
            <UsersRound className="size-5" />
          </div>
          <p className="section-eyebrow mb-4">{eyebrow}</p>
          <h2 className="public-heading-display mb-5 max-w-4xl">{title}</h2>
          <p className="public-copy-lead max-w-2xl">{description}</p>
        </div>

        <div className="relative w-full">
          {/* Edge fades follow the writing direction so they stay on the
              leading/trailing edge in both LTR and RTL locales. */}
          <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-20 bg-gradient-to-r from-background via-background/88 to-transparent rtl:bg-gradient-to-l md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-20 bg-gradient-to-l from-background via-background/88 to-transparent rtl:bg-gradient-to-r md:w-28" />

          <Marquee className="[--duration:48s] [--gap:1.125rem] md:[--gap:1.5rem]" pauseOnHover>
            {members.map((member) => (
              <article
                key={member.name}
                className="flex w-[19rem] shrink-0 flex-col justify-between gap-6 rounded-[2rem] border border-border/65 bg-card/80 p-6 shadow-[0_24px_70px_-48px_hsl(var(--foreground)/0.3)] backdrop-blur-xl sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold leading-7 text-foreground">
                    {member.name}
                  </h3>
                  <p className="public-support-text">{member.role}</p>
                </div>
              </article>
            ))}
          </Marquee>
        </div>

        <div className="mx-auto mt-14 max-w-3xl px-2 text-center md:mt-20">
          <div className="surface-subtle px-6 py-8 sm:px-8">
            <Quote
              aria-hidden="true"
              className="mx-auto mb-5 size-6 text-primary/70"
            />
            <blockquote className="mb-6 text-lg font-medium leading-8 text-foreground md:text-xl">
              {testimonial.quote}
            </blockquote>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="public-support-text">{testimonial.role}</p>
            </div>

            {cta ? (
              <div className="mt-8">
                <Button asChild variant="soft" size="lg" className="rounded-full px-8">
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
