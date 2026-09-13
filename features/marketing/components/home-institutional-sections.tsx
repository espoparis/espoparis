import Image from "next/image";
import { InstitutionalGeometry } from "./institutional-geometry";
import {
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Link } from "@/lib/navigation";
import { FOUNDER_IMAGE, getFacultyImage } from "@/features/marketing/faculty-images";
import type { AboutContent } from "@/features/marketing/about-content";

type Props = {
  locale: string;
  aboutHref: string;
  registerHref: string;
  content: AboutContent;
};


export function HomeInstitutionalSections({
  locale,
  aboutHref,
  content,
}: Props) {
  const programs = [...content.programs.tracks, content.programs.weekendSchools];
  const featuredFaculty = content.faculty.members.slice(0, 3);

  return (
    <>
      <section className="page-shell py-14 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="section-eyebrow">{content.overview.eyebrow}</p>
            <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(2.4rem,5vw,4.7rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
              {content.overview.title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              {content.overview.description}
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-sm px-6">
              <Link href={aboutHref} locale={locale}>
                {content.hero.eyebrow}
                <ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
              </Link>
            </Button>
          </Reveal>

          <Stagger className="divide-y divide-border">
            {content.overview.cards.slice(0, 4).map((card, index) => (
              <StaggerItem key={card.title}>
              <article
                key={card.title}
                className="py-8 first:pt-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-4xl font-medium text-primary/22">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="size-2 rounded-sm bg-accent" />
                </div>
                <h3 className="mt-5 max-w-xl font-display text-2xl font-semibold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {card.description}
                </p>
              </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="full-bleed bg-[#0b3429] py-16 text-white sm:py-20 lg:py-24">
        <div className="page-shell">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#d7b56d]">
              {content.distinctives.eyebrow}
            </p>
            <h2 className="mt-4 text-balance font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
              {content.distinctives.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              {content.distinctives.description}
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 lg:grid-cols-2">
            {content.distinctives.items.map((item) => {
              return (
                <StaggerItem key={item.title}>
                <article
                  key={item.title}
                  className="border-t border-white/25 py-8 sm:pe-8"
                >
                  <div className="flex size-12 items-center justify-center">
                    <InstitutionalGeometry className="size-12 text-[#d7b56d]" />
                  </div>
                  <h3 className="mt-7 font-display text-3xl font-medium tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                    {item.description}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {item.points.map((point) => (
                      <span
                        key={point}
                        className="border-s border-white/30 ps-3 py-1.5 text-xs font-medium text-white/72"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20 lg:py-28">
        <Reveal className="max-w-3xl">
          <p className="section-eyebrow">{content.programs.eyebrow}</p>
          <h2 className="mt-4 public-heading-display max-w-[15ch]">{content.programs.title}</h2>
          <p className="mt-5 public-copy-lead">{content.programs.description}</p>
        </Reveal>

        <Stagger className="mt-12 divide-y divide-border">
          {programs.map((program, index) => {
            return (
              <StaggerItem key={program.title}>
              <article
                key={program.title}
                className="editorial-layout border-t border-border py-9"
              >
                <div>
                  <p className="section-eyebrow">0{index + 1}</p>
                  <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-foreground">{program.title}</h3>
                </div>
                <div>
                  <p className="text-base leading-8 text-muted-foreground">{program.description}</p>
                  <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-muted-foreground">{program.points[0]}</p>
                  <Link href="/academic-program" locale={locale} className="mt-6 inline-flex items-center gap-2 border-b border-primary/40 pb-2 text-sm font-medium text-primary hover:border-primary">{content.programs.eyebrow}<ArrowUpRight className="size-4 rtl:-rotate-90" /></Link>
                </div>
              </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-28">
        <Reveal>
        <div className="overflow-hidden rounded-sm border border-border/60 bg-[#f0eadb] dark:bg-card">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative min-h-[28rem] overflow-hidden lg:min-h-[42rem]">
              <Image
                src={FOUNDER_IMAGE}
                alt={content.founder.photoAlt}
                fill
                className="editorial-portrait object-cover object-top"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b3429]/55 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 rounded-sm border border-white/15 bg-[#0b3429]/78 p-5 text-white sm:inset-x-8 sm:bottom-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e4c579]">
                  {content.founder.eyebrow}
                </p>
                <p className="mt-2 font-display text-2xl font-medium">{content.founder.name}</p>
                <p className="mt-1 text-sm text-white/65">{content.founder.role}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14 xl:p-16">
              <p className="section-eyebrow">{content.founder.eyebrow}</p>
              <h2 className="mt-4 max-w-[13ch] font-display text-[clamp(2.3rem,4.6vw,4.25rem)] font-medium leading-[1] tracking-[-0.045em] text-foreground">
                {content.founder.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {content.founder.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {content.founder.facts.slice(0, 4).map((fact) => (
                  <div key={`${fact.label}-${fact.value}`} className="border-t border-border py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-foreground sm:text-base">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-8 w-fit rounded-sm px-6">
                <Link href="/about/founder" locale={locale}>
                  {content.founder.name}
                  <ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <Reveal>
            <p className="section-eyebrow">{content.faculty.eyebrow}</p>
            <h2 className="mt-4 public-heading-display max-w-[12ch]">{content.faculty.title}</h2>
            <p className="mt-5 public-copy-lead">{content.faculty.description}</p>
          </Reveal>

          <Stagger className="space-y-8">
            {featuredFaculty.map((member) => {
              const image = member.image || getFacultyImage(member.id);
              return (
                <StaggerItem key={member.id}>
                <article key={member.id} className="grid min-w-0 gap-6 border-b border-border pb-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary/70">
                    {image ? (
                      <Image
                        src={image} unoptimized={image.startsWith("/api/content-media/")}
                        alt={member.name}
                        fill
                        className="editorial-portrait object-cover object-top"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 90vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--primary)/.14),transparent_58%)]">
                        <span className="font-display text-5xl text-primary/35">{member.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 self-center">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground"><Link href={`/faculty/${member.id}`} locale={locale} className="hover:underline underline-offset-4">{member.name}</Link></h3>
                    <p className="mt-2 text-sm leading-6 text-primary">{member.role}</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{member.bio}</p>
                  </div>
                </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="page-shell pb-16 sm:pb-20 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <Reveal>
            <p className="section-eyebrow">{content.advisoryBoard.eyebrow}</p>
            <h2 className="mt-4 public-heading-display max-w-[13ch]">{content.advisoryBoard.title}</h2>
            <p className="mt-5 public-copy-lead">{content.advisoryBoard.description}</p>
          </Reveal>

          <Stagger className="grid gap-4">
            {content.advisoryBoard.members.slice(0, 3).map((member, index) => (
              <StaggerItem key={member.name}>
              <article
                key={member.name}
                className="border-t border-border py-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold tracking-[0.2em] text-accent">
                      0{index + 1}
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                      {member.name}
                    </h3>
                  </div>
                  <span className="rounded-sm border border-border/70 bg-secondary/55 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    {member.country}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                  {member.credentials[0]}
                </p>
              </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="full-bleed overflow-hidden bg-[#efe9dc] py-16 dark:bg-card sm:py-20 lg:py-24">
        <div className="page-shell">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <Reveal>
              <p className="section-eyebrow">{content.network.eyebrow}</p>
              <h2 className="mt-4 public-heading-display max-w-[13ch]">{content.network.title}</h2>
              <p className="mt-5 public-copy-lead">{content.network.description}</p>
            </Reveal>
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {content.network.institutes.slice(0, 4).map((institute, index) => (
                <StaggerItem key={`${institute.country}-${institute.institute}`}>
                <article
                  key={`${institute.country}-${institute.institute}`}
                  className="border-t border-border py-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <MapPin className="mt-1 size-5 shrink-0 text-primary" />
                    <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {institute.country}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-primary">{institute.institute}</p>
                </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

    </>
  );
}

export function HomeAdmissionsSection({ locale, registerHref, content }: Pick<Props, "locale" | "registerHref" | "content">) {
  return (
      <section className="page-shell py-16 sm:py-20 lg:py-28">
        <Reveal>
        <div className="relative overflow-hidden rounded-sm bg-[#0b3429] px-7 py-12 text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -end-16 -top-28 size-80 rotate-45 border border-[#d7b56d]/20" />
          <div className="pointer-events-none absolute -end-3 -top-10 size-52 border border-white/10" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#d7b56d]">
                {content.programs.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[13ch] font-display text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                {content.hero.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg">
                {content.hero.description}
              </p>
            </div>
            <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal rounded-sm bg-[#faf7ef] px-7 py-3 text-[#0b3429] hover:bg-white">
              <Link href={registerHref} locale={locale}>
                {content.programs.eyebrow}
                <ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
              </Link>
            </Button>
          </div>
        </div>
        </Reveal>
      </section>
  );
}
