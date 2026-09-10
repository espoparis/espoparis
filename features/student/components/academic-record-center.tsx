import Link from "next/link";
import { Award, BookOpenCheck, CalendarDays, LockKeyhole, ShieldCheck } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { canUseAcademicWorkspace } from "@/server/auth/policy";

export type AcademicRecordCopy = {
  eyebrow:string; title:string; description:string; lockedTitle:string; lockedDescription:string; signInLabel:string;
  cards:Array<{title:string;description:string;icon:"history"|"average"|"attendance"}>;
  privacyTitle:string; privacyDescription:string;
};
const icons={history:BookOpenCheck,average:Award,attendance:CalendarDays};
export function AcademicRecordCenter({copy,session,locale}:{copy:AcademicRecordCopy;session:AuthSession;locale:string}){
  const decision=canUseAcademicWorkspace(session,"student");
  return <main className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
    <header className="mx-auto max-w-4xl text-center"><p className="section-eyebrow">{copy.eyebrow}</p><h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.5rem)] font-medium leading-[.95] tracking-[-.05em]">{copy.title}</h1><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p></header>
    {!decision.allowed?<section className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-border bg-card p-8 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole className="size-6"/></div><h2 className="mt-5 font-display text-3xl font-semibold">{copy.lockedTitle}</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{copy.lockedDescription}</p><Link href={`/${locale}/sign-in`} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">{copy.signInLabel}</Link></section>:<section className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">{copy.cards.map(c=>{const Icon=icons[c.icon];return <article key={c.title} className="rounded-[1.75rem] border border-border bg-card p-6"><Icon className="size-5 text-primary"/><h2 className="mt-4 font-display text-2xl font-semibold">{c.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{c.description}</p></article>})}</section>}
    <aside className="mx-auto mt-8 max-w-5xl rounded-[1.75rem] border border-border bg-secondary/35 p-6"><div className="flex gap-3"><ShieldCheck className="mt-1 size-5 shrink-0 text-primary"/><div><h2 className="font-semibold">{copy.privacyTitle}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.privacyDescription}</p></div></div></aside>
  </main>;
}
