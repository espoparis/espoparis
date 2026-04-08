"use client";

import Image from "next/image";
import { UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type TeamMember = {
  image: string;
  name: string;
  role: string;
  imageAlt?: string;
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
    image: string;
    imageAlt?: string;
  };
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
};

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
      <svg
        aria-hidden="true"
        className="absolute right-0 top-10 h-40 w-80 text-primary/10"
        fill="none"
        viewBox="0 0 460 154"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#team-wave)">
          <path
            d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="40"
          />
        </g>
        <defs>
          <clipPath id="team-wave">
            <rect fill="white" height="154" width="460" />
          </clipPath>
        </defs>
      </svg>

      <div className="page-shell relative z-10">
        <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center md:mb-20">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground hero-glow">
            <UsersRound className="size-5" />
          </div>
          <p className="section-eyebrow mb-4">{eyebrow}</p>
          <h2 className="public-heading-display mb-5 max-w-4xl">
            {title}
          </h2>
          <p className="public-copy-lead max-w-2xl">
            {description}
          </p>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/88 to-transparent md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/88 to-transparent md:w-28" />

          <Marquee className="[--duration:42s] [--gap:1.125rem] md:[--gap:1.5rem]" pauseOnHover>
            {members.map((member) => (
              <article key={member.name} className="group flex w-[16rem] shrink-0 flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/65 bg-card shadow-[0_24px_70px_-42px_hsl(var(--foreground)/0.32)]">
                  <Image
                    src={member.image}
                    alt={member.imageAlt ?? member.name}
                    fill
                    sizes="(max-width: 768px) 256px, 288px"
                    className="object-cover transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0 grayscale-[8%]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/84 to-transparent px-4 pb-4 pt-12">
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="public-support-text">{member.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </Marquee>
        </div>

        <div className="mx-auto mt-14 max-w-3xl px-2 text-center md:mt-20">
          <div className="surface-subtle px-6 py-7 sm:px-8">
            <p className="mb-8 text-lg font-medium leading-8 text-foreground md:text-xl">
              {testimonial.quote}
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/70">
                <Image
                  src={testimonial.image}
                  alt={testimonial.imageAlt ?? testimonial.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="public-support-text">{testimonial.role}</p>
              </div>
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
