import { ClipboardCheck, Eye, LockKeyhole, ShieldCheck, Upload } from 'lucide-react';
import type { AuthSession } from '@/server/auth/types';
import { canUseAcademicWorkspace } from '@/server/auth/policy';

export type GradeReviewCopy = {
  eyebrow: string; title: string; description: string; lockedTitle: string; lockedDescription: string;
  steps: Array<{title:string;description:string}>;
  ruleTitle:string; ruleDescription:string; visibilityTitle:string; visibilityDescription:string;
};

export function GradeReviewCenter({copy, session}:{copy:GradeReviewCopy;session:AuthSession}) {
  const decision = canUseAcademicWorkspace(session,'editor');
  return <main className="full-bleed bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
    <section className="page-shell py-16 pt-36 sm:pt-40 lg:py-24 lg:pt-44">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p>
      <h1 className="mt-4 max-w-4xl font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p>
      {!decision.allowed ? <div className="mt-10 max-w-3xl rounded-[2rem] border border-[#dccca9] bg-white p-8 dark:border-white/10 dark:bg-white/[0.04]"><LockKeyhole className="size-6 text-[#98772f]"/><h2 className="mt-4 font-display text-2xl">{copy.lockedTitle}</h2><p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.lockedDescription}</p></div> : null}
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{copy.steps.map((s,i)=><article key={s.title} className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><span className="text-xs font-semibold text-[#98772f]">0{i+1}</span><ClipboardCheck className="mt-4 size-5 text-[#98772f]"/><h2 className="mt-4 text-lg font-semibold">{s.title}</h2><p className="mt-2 text-sm leading-7 text-[#62736d] dark:text-white/60">{s.description}</p></article>)}</div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2"><article className="rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]"><ShieldCheck className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.ruleTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.ruleDescription}</p></article><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><Eye className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.visibilityTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.visibilityDescription}</p></article></div>
    </section>
  </main>;
}
