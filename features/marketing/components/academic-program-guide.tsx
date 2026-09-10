"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpenCheck, GraduationCap, Layers3, Sparkles } from "lucide-react";

export type Semester = { label: string; courses: string[] };
export type AcademicYear = { year: string; stage: string; description: string; semesters: Semester[]; milestone?: string };
export type StudyField = { title: string; items: string };
export type AcademicProgramCopy = {
  eyebrow: string; title: string; description: string; facts: string[];
  pathwayTitle: string; curriculumTitle: string; fieldsTitle: string; fieldsDescription: string;
  years: AcademicYear[]; fields: StudyField[]; noteTitle: string; note: string;
};

export function AcademicProgramGuide({ copy }: { copy: AcademicProgramCopy }) {
  const reduce = useReducedMotion();
  const enter = reduce ? {} : { initial:{opacity:0,y:18}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:.16}, transition:{duration:.55} };
  return <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
    <header className="mx-auto max-w-4xl text-center">
      <p className="section-eyebrow">{copy.eyebrow}</p>
      <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.2rem)] font-medium leading-[.95] tracking-[-.055em]">{copy.title}</h1>
      <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p>
      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">{copy.facts.map(f=><span key={f} className="rounded-full border border-primary/15 bg-primary/[.05] px-4 py-2 text-sm font-medium">{f}</span>)}</div>
    </header>

    <motion.section {...enter} className="mx-auto mt-16 max-w-6xl rounded-[2.25rem] bg-[#082e24] p-7 text-white sm:p-10">
      <div className="flex items-center gap-3"><GraduationCap className="size-6 text-[#e2c27b]"/><h2 className="font-display text-3xl font-semibold">{copy.pathwayTitle}</h2></div>
      <div className="mt-8 grid gap-3 md:grid-cols-4">{copy.years.map((y,i)=><div key={y.year} className="rounded-[1.5rem] border border-white/10 bg-white/[.055] p-5"><span className="text-xs font-semibold uppercase tracking-[.18em] text-[#e2c27b]">0{i+1}</span><h3 className="mt-3 text-lg font-semibold">{y.year}</h3><p className="mt-1 text-sm text-white/65">{y.stage}</p></div>)}</div>
    </motion.section>

    <section className="mx-auto mt-20 max-w-6xl">
      <div className="max-w-3xl"><p className="section-eyebrow">{copy.eyebrow}</p><h2 className="mt-4 public-heading-display">{copy.curriculumTitle}</h2></div>
      <div className="mt-10 space-y-6">{copy.years.map((y,i)=><motion.article {...enter} key={y.year} className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="grid gap-5 border-b border-border/70 bg-secondary/35 p-6 sm:p-8 lg:grid-cols-[.28fr_.72fr]"><div><span className="text-sm font-semibold text-primary">0{i+1}</span><h3 className="mt-2 font-display text-3xl font-semibold">{y.year}</h3><p className="mt-2 font-medium text-primary">{y.stage}</p></div><p className="self-center text-sm leading-7 text-muted-foreground sm:text-base">{y.description}</p></div>
        <div className="grid gap-0 md:grid-cols-2">{y.semesters.map((s,si)=><div key={s.label} className={`p-6 sm:p-8 ${si===1?'border-t md:border-s md:border-t-0':''} border-border/70`}><h4 className="flex items-center gap-2 font-semibold"><Layers3 className="size-4 text-primary"/>{s.label}</h4><ol className="mt-5 space-y-3">{s.courses.map((c,ci)=><li key={c} className="flex gap-3 text-sm leading-6"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/8 text-[11px] font-bold text-primary">{ci+1}</span><span>{c}</span></li>)}</ol></div>)}</div>
        {y.milestone&&<div className="border-t border-border/70 bg-[#d7b56d]/10 px-6 py-4 text-sm font-semibold text-primary sm:px-8">{y.milestone}</div>}
      </motion.article>)}</div>
    </section>

    <motion.section {...enter} className="mx-auto mt-20 max-w-6xl">
      <div className="max-w-3xl"><p className="section-eyebrow">{copy.eyebrow}</p><h2 className="mt-4 public-heading-display">{copy.fieldsTitle}</h2><p className="mt-4 public-copy-lead">{copy.fieldsDescription}</p></div>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{copy.fields.map(f=><article key={f.title} className="rounded-[1.6rem] border border-border bg-card p-6"><BookOpenCheck className="size-5 text-primary"/><h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{f.items}</p></article>)}</div>
    </motion.section>

    <section className="mx-auto mt-14 max-w-6xl rounded-[1.6rem] border border-[#d7b56d]/30 bg-[#d7b56d]/10 p-6 sm:p-8"><div className="flex gap-4"><Sparkles className="mt-1 size-5 shrink-0 text-primary"/><div><h2 className="font-semibold">{copy.noteTitle}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.note}</p></div></div></section>
  </div>;
}
