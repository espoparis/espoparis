import { BookOpen, CircleAlert, Database, GraduationCap, ShieldCheck } from "lucide-react";
import type { DigitalSnapshot } from "@/server/digital/repository";
import type { UserRole } from "@/server/platform/types";
import { LearningAuthoringForm, LibraryAuthoringForm, type DigitalAuthoringCopy } from "./digital-authoring-forms";

export type DigitalWorkspaceCopy = {
  eyebrow: string; title: string; description: string; connected: string; notConfigured: string; error: string;
  libraryCount: string; lessonCount: string; safetyTitle: string; safetyDescription: string; empty: string;
};

export function DigitalPlatformWorkspace({ copy, authoring, snapshot, mode, locale, role }: { copy: DigitalWorkspaceCopy; authoring: DigitalAuthoringCopy; snapshot: DigitalSnapshot; mode: "library" | "learning"; locale: string; role: UserRole }) {
  const connected = snapshot.state === "connected";
  const count = mode === "library" ? snapshot.books.length : snapshot.lessons.length;
  const Icon = mode === "library" ? BookOpen : GraduationCap;
  return <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
    <header className="mx-auto max-w-4xl"><p className="section-eyebrow">{copy.eyebrow}</p><h1 className="mt-4 font-display text-4xl font-semibold sm:text-6xl">{copy.title}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{copy.description}</p></header>
    <section className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-3">
      <article className="rounded-[2rem] border border-border bg-card p-6"><Database className="size-5 text-primary"/><p className="mt-4 text-sm text-muted-foreground">{connected ? copy.connected : snapshot.state === "error" ? copy.error : copy.notConfigured}</p><p className="mt-3 font-display text-4xl font-semibold">{count}</p><p className="mt-2 text-sm text-muted-foreground">{mode === "library" ? copy.libraryCount : copy.lessonCount}</p></article>
      <article className="rounded-[2rem] border border-border bg-card p-6 lg:col-span-2"><ShieldCheck className="size-5 text-primary"/><h2 className="mt-4 font-display text-2xl font-semibold">{copy.safetyTitle}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.safetyDescription}</p>{!connected ? <div className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 text-sm text-muted-foreground"><CircleAlert className="mt-0.5 size-4 shrink-0 text-primary"/>{copy.empty}</div> : null}</article>
    </section>
    <div className="mx-auto mt-6 max-w-6xl">
      {mode === "library"
        ? <LibraryAuthoringForm records={snapshot.books} locale={locale} role={role} copy={authoring} connected={connected} />
        : <LearningAuthoringForm records={snapshot.lessons} locale={locale} role={role} copy={authoring} connected={connected} />}
    </div>
  </div>;
}
