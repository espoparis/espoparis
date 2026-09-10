"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, ChevronRight, Download, GraduationCap, LockKeyhole, PlayCircle } from "lucide-react";
import type { PublishedLessonMetadata } from "@/server/platform/types";

export type LearningCopy = {
  eyebrow: string;
  title: string;
  description: string;
  hierarchyTitle: string;
  hierarchy: string[];
  featuresTitle: string;
  features: { title: string; description: string; icon: string }[];
  accessNote: string;
  catalogTitle: string;
  catalogDescription: string;
  recordingsPending: string;
  portalLabel: string;
};

type AcademicYear = {
  year: string;
  stage: string;
  description: string;
  semesters: { label: string; courses: string[] }[];
  milestone?: string;
};

const icons = { play: PlayCircle, download: Download, progress: BookOpenCheck, access: LockKeyhole };

export function LearningShell({ copy, years, lessons, locale }: { copy: LearningCopy; years: AcademicYear[]; lessons: PublishedLessonMetadata[]; locale: string }) {
  const [selectedYear, setSelectedYear] = useState(0);
  const activeYear = useMemo(() => years[selectedYear] ?? years[0], [years, selectedYear]);
  const activeLessons = useMemo(() => lessons.filter((lesson) => lesson.year === selectedYear + 1), [lessons, selectedYear]);

  return (
    <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
      <header className="mx-auto max-w-4xl text-center">
        <p className="section-eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[.94] tracking-[-.055em]">{copy.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p>
      </header>

      <section className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-[#082e24] p-7 text-white sm:p-9">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10"><GraduationCap className="size-6 text-[#e2c27b]" /></div>
          <h2 className="mt-6 font-display text-3xl font-semibold">{copy.hierarchyTitle}</h2>
          <div className="mt-7 space-y-3">
            {copy.hierarchy.map((item, i) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.05] px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#d7b56d] text-xs font-bold text-[#082e24]">{i + 1}</span>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-7 sm:p-9">
          <h2 className="font-display text-3xl font-semibold">{copy.featuresTitle}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {copy.features.map((f) => {
              const Icon = icons[f.icon as keyof typeof icons] || PlayCircle;
              return <article key={f.title} className="rounded-2xl border border-border/70 bg-background p-5"><Icon className="size-5 text-primary" /><h3 className="mt-4 font-semibold">{f.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{f.description}</p></article>;
            })}
          </div>
          <p className="mt-6 rounded-2xl bg-secondary/55 p-4 text-sm leading-6 text-muted-foreground">{copy.accessNote}</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <div className="max-w-3xl">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{copy.catalogTitle}</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">{copy.catalogDescription}</p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {years.map((year, index) => (
            <button key={year.year} onClick={() => setSelectedYear(index)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${selectedYear === index ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"}`}>
              {year.year}
            </button>
          ))}
        </div>

        {activeYear && (
          <div className="mt-5 rounded-[2rem] border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-3 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-semibold text-primary">{activeYear.stage}</p><h3 className="mt-1 font-display text-3xl font-semibold">{activeYear.year}</h3></div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{activeYear.description}</p>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {activeYear.semesters.map((semester) => (
                <article key={semester.label} className="rounded-2xl border border-border/70 bg-background p-5">
                  <h4 className="font-semibold">{semester.label}</h4>
                  <div className="mt-4 space-y-2">
                    {semester.courses.map((course) => (
                      <div key={course} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/45 px-3 py-3 text-sm">
                        <span>{course}</span><ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {activeLessons.length ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {activeLessons.map((lesson) => (
                  <article key={lesson.id} className="rounded-2xl border border-border/70 bg-secondary/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">{lesson.courseTitle}</p>
                    <h4 className="mt-2 font-semibold">{lesson.title}</h4>
                    {lesson.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{lesson.description}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">{copy.recordingsPending}</p><Link href={`/${locale}/student`} className="shrink-0 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">{copy.portalLabel}</Link></div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
