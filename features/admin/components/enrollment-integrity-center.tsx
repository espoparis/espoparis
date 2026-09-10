import { AlertTriangle, Database, Link2, LockKeyhole, ShieldCheck, Wrench } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { canUseAcademicWorkspace } from "@/server/auth/policy";

export type EnrollmentIntegrityCopy = {
  eyebrow: string; title: string; description: string; lockedTitle: string; lockedDescription: string;
  cards: Array<{ title: string; description: string; icon: "database" | "repair" | "identity" | "safety" }>;
  workflowTitle: string; workflow: string[]; liveTitle: string; liveDescription: string;
};
const icons = { database: Database, repair: Wrench, identity: Link2, safety: ShieldCheck };

export function EnrollmentIntegrityCenter({ copy, session }: { copy: EnrollmentIntegrityCopy; session: AuthSession }) {
  const decision = canUseAcademicWorkspace(session, "admin");
  return <main className="full-bleed bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
    <section className="page-shell py-14 sm:py-18 lg:py-24">
      <div className="max-w-4xl"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p><h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p></div>
      {!decision.allowed ? <div className="mt-10 max-w-3xl rounded-[2rem] border border-[#dccca9] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><LockKeyhole className="size-6 text-[#98772f]"/><h2 className="mt-5 font-display text-2xl font-medium">{copy.lockedTitle}</h2><p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.lockedDescription}</p></div> : <div className="mt-10 grid gap-5 md:grid-cols-2">{copy.cards.map((card)=>{const Icon=icons[card.icon];return <article key={card.title} className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><Icon className="size-5 text-[#98772f]"/><h2 className="mt-4 text-lg font-semibold">{card.title}</h2><p className="mt-2 text-sm leading-7 text-[#62736d] dark:text-white/60">{card.description}</p></article>})}</div>}
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><article className="rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]"><h2 className="font-display text-xl font-medium">{copy.workflowTitle}</h2><ol className="mt-4 space-y-3">{copy.workflow.map((step,index)=><li key={step} className="flex gap-3 text-sm leading-6"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0f4738] text-xs font-semibold text-[#e9cd8a]">{index+1}</span><span>{step}</span></li>)}</ol></article><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><AlertTriangle className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl font-medium">{copy.liveTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.liveDescription}</p></article></div>
    </section>
  </main>;
}
