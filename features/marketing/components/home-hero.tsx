"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { InstitutionalGeometry } from "./institutional-geometry";

type Props = {
  badge: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  highlights: { label: string }[];
  featureTitle: string;
  featureDescription: string;
};

export function HomeHero({ badge, title, description, primaryCta, secondaryCta, highlights, featureTitle, featureDescription }: Props) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="full-bleed relative isolate overflow-hidden bg-[#082e24] text-[#faf7ef]">
      <InstitutionalGeometry className="pointer-events-none absolute -end-32 top-12 -z-10 w-[32rem] text-[#c6a25e]/20" />
      <div className="page-shell pb-12 pt-16 sm:pb-16 sm:pt-24 lg:pt-28">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-[.18em] text-[#d7b56d]"><span aria-hidden="true" className="h-px w-10 shrink-0 bg-current" />{badge}</p>
          <h1 className="mt-8 max-w-[19ch] text-balance font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[1.06] tracking-[-.025em]">{title}</h1>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-24">
            <div>
              <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="h-auto min-h-12 whitespace-normal rounded-sm bg-[#faf7ef] px-6 py-3 text-[#082e24] shadow-none hover:bg-white"><Link href={primaryCta.href}>{primaryCta.label}<ArrowRight className="size-4 shrink-0 rtl:rotate-180" /></Link></Button>
                <Link href={secondaryCta.href} className="border-b border-white/40 px-1 py-3 text-sm font-medium text-white hover:border-white">{secondaryCta.label}</Link>
              </div>
            </div>
            <div className="border-t border-white/25 pt-7 lg:border-s lg:border-t-0 lg:ps-10 lg:pt-0">
              <Image src="/official-logo.jpg" alt="Imam (AJ) Center – Paris" width={100} height={100} className="mb-6 h-16 w-auto object-contain" priority />
              <h2 className="font-display text-2xl font-medium sm:text-3xl">{featureTitle}</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">{featureDescription}</p>
            </div>
          </div>
          <ul className="mt-14 grid gap-5 border-t border-white/20 pt-6 text-sm leading-6 text-white/75 sm:grid-cols-3 lg:mt-20">
            {highlights.slice(0, 3).map(({ label }) => <li key={label}>{label}</li>)}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
