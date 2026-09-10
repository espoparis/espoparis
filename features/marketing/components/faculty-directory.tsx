"use client";

import Image from "next/image";
import { BookOpen, ChevronDown, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { getFacultyImage } from "@/features/marketing/faculty-images";
import { Link } from "@/lib/navigation";
import type { FacultyMember } from "@/features/marketing/components/about-faculty-section";

type Props = { members: FacultyMember[]; languagesLabel: string; worksLabel: string; photoAltTemplate: string };

export function FacultyDirectory({ members, languagesLabel, worksLabel, photoAltTemplate }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {members.map((member, index) => {
        const image = getFacultyImage(member.id);
        return (
          <motion.details
            key={member.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
            className="group overflow-hidden rounded-[2rem] border border-border/65 bg-card shadow-[0_30px_80px_-58px_hsl(var(--foreground)/0.38)]"
          >
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/60">
                {image ? (
                  <Image src={image} alt={photoAltTemplate.replace("{name}", member.name)} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]" sizes="(min-width:1280px) 33vw,(min-width:768px) 50vw,100vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--primary)/.15),transparent_62%)]"><BookOpen className="size-10 text-primary/35" /></div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="font-display text-2xl font-semibold tracking-tight">{member.name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{member.role}</p></div>
                  <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background"><ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" /></span>
                </div>
              </div>
            </summary>
            <div className="border-t border-border/60 px-6 pb-6 pt-5">
              <p className="text-sm leading-7 text-muted-foreground">{member.bio}</p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary/55 p-4"><Languages className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">{languagesLabel}</p><p className="mt-1 text-sm text-muted-foreground">{member.languages}</p></div></div>
              <div className="mt-5"><Link href={`/faculty/${member.id}`} className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">{member.name}</Link></div>
              {member.works?.length ? <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">{worksLabel}</p><ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{member.works.map((work)=><li key={work} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{work}</li>)}</ul></div> : null}
            </div>
          </motion.details>
        );
      })}
    </div>
  );
}
