"use client";

import { ArrowRight, BookOpenText, Globe2, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

type Props = {
  badge: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  highlights: { label: string }[];
  featureTitle: string;
  featureDescription: string;
};

export function HomeHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  featureTitle,
  featureDescription,
}: Props) {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number, y = 24) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative full-bleed isolate overflow-hidden bg-[#082e24] pt-36 text-white md:pt-44">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_16%,rgba(194,158,86,0.18),transparent_26%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(140deg,#082e24_0%,#0b3a2c_48%,#071f19_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute -start-24 top-40 -z-10 size-[30rem] rounded-full border border-[#c6a25e]/20" />
      <div className="absolute -start-8 top-56 -z-10 size-[18rem] rounded-full border border-[#c6a25e]/15" />
      <div className="absolute end-[-8rem] bottom-[-12rem] -z-10 size-[34rem] rotate-12 rounded-[6rem] border border-white/10" />

      <div className="page-shell pb-16 md:pb-24 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.12fr_.88fr] lg:gap-20">
          <motion.div className="max-w-4xl" {...rise(0.05)}>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#d7b56d]/35 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#ecd9a5] backdrop-blur-md sm:text-sm">
              <span className="size-1.5 rounded-full bg-[#d7b56d]" />
              {badge}
            </div>

            <h1 className="max-w-5xl text-balance font-display text-[clamp(3.25rem,7vw,6.7rem)] font-medium leading-[0.93] tracking-[-0.055em] text-white">
              {title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg sm:leading-9">
              {description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-[#c6a25e] px-7 text-[#082e24] shadow-[0_18px_46px_-22px_rgba(198,162,94,.8)] hover:bg-[#d1b16e]">
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ms-2 size-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/20 bg-white/[0.04] px-7 text-white hover:bg-white/10 hover:text-white">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {highlights.slice(0, 3).map(({ label }, index) => {
                const icons = [GraduationCap, Globe2, BookOpenText];
                const Icon = icons[index] ?? BookOpenText;
                return (
                  <div key={label} className="flex items-center gap-3 border-t border-white/12 pt-4 text-sm text-white/70">
                    <Icon className="size-4 text-[#d7b56d]" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:ms-auto" {...rise(0.2, 18)}>
            <motion.div
              className="absolute -inset-7 rounded-[3.25rem] border border-[#d7b56d]/15"
              animate={reduceMotion ? undefined : { rotate: [0, 1.2, 0], scale: [1, 1.012, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative overflow-hidden rounded-[2.75rem] border border-white/12 bg-white/[0.055] p-7 shadow-[0_40px_100px_-50px_rgba(0,0,0,.9)] backdrop-blur-2xl sm:p-10">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b56d]/70 to-transparent" />
              <div className="flex min-h-[25rem] flex-col justify-between sm:min-h-[29rem]">
                <div className="flex items-start justify-between gap-6">
                  <div className="rounded-[1.4rem] bg-white p-2 shadow-xl"><Image src="/official-logo.jpg" alt="Imam (AJ) Center – Paris" width={132} height={132} className="h-20 w-auto object-contain sm:h-24" priority /></div>
                  <span className="rounded-full border border-white/12 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Paris
                  </span>
                </div>

                <div>
                  <div className="mb-6 h-px w-20 bg-[#d7b56d]" />
                  <p className="max-w-sm font-display text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
                    {featureTitle}
                  </p>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/62 sm:text-base">
                    {featureDescription}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-8 rounded-t-[2.5rem] bg-background sm:h-12 sm:rounded-t-[3.5rem]" />
    </section>
  );
}
