import Link from "next/link";
import { BookOpen, CalendarCheck2, GraduationCap, LockKeyhole, PlayCircle, ShieldCheck, Trophy } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { StudentAccessMap, type StudentAccessMapCopy } from "./student-access-map";

export type StudentPortalCopy = {
  eyebrow: string;
  title: string;
  description: string;
  signedOutTitle: string;
  signedOutDescription: string;
  signInLabel: string;
  backToLearning: string;
  securityNote: string;
  sections: { title: string; description: string; icon: "courses" | "progress" | "library" | "grades" | "attendance" }[];
  pendingLabel: string;
  accessMap: StudentAccessMapCopy;
};

const icons = {
  courses: PlayCircle,
  progress: GraduationCap,
  library: BookOpen,
  grades: Trophy,
  attendance: CalendarCheck2,
};

export function StudentPortalShell({
  copy,
  session,
  locale,
}: {
  copy: StudentPortalCopy;
  session: AuthSession;
  locale: string;
}) {
  const signedIn = session.authenticated && session.identity;

  return (
    <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
      <header className="mx-auto max-w-4xl text-center">
        <p className="section-eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6rem)] font-medium leading-[.95] tracking-[-.055em]">{copy.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p>
      </header>

      {!signedIn ? (
        <section className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-border bg-card p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="size-6" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-semibold">{copy.signedOutTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{copy.signedOutDescription}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/${locale}/sign-in`} className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              {copy.signInLabel}
            </Link>
            <Link href={`/${locale}/learning`} className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-primary/50">
              {copy.backToLearning}
            </Link>
          </div>
          <p className="mt-6 flex items-start justify-center gap-2 rounded-2xl bg-secondary/45 p-4 text-start text-xs leading-6 text-muted-foreground sm:text-sm">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            {copy.securityNote}
          </p>
        </section>
      ) : null}

      <StudentAccessMap copy={copy.accessMap} />

      <section className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {copy.sections.map((section) => {
          const Icon = icons[section.icon];
          return (
            <article key={section.title} className="rounded-[1.75rem] border border-border bg-card p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{copy.pendingLabel}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
