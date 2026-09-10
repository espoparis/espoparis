import { CalendarCheck2, ClipboardCheck, FileSpreadsheet, LockKeyhole, Send, ShieldCheck } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { canUseAcademicWorkspace } from "@/server/auth/policy";

export type TeacherPortalCopy = {
  eyebrow: string;
  title: string;
  description: string;
  lockedTitle: string;
  lockedDescription: string;
  workflowTitle: string;
  workflow: Array<{ title: string; description: string; icon: "gradebook" | "attendance" | "submit" | "publish" }>;
  storageTitle: string;
  storageDescription: string;
  safetyTitle: string;
  safetyDescription: string;
};

const icons = { gradebook: FileSpreadsheet, attendance: CalendarCheck2, submit: Send, publish: ClipboardCheck };

export function TeacherGradebookShell({ copy, session }: { copy: TeacherPortalCopy; session: AuthSession }) {
  const decision = canUseAcademicWorkspace(session, "teacher");
  return (
    <main className="full-bleed bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
      <section className="page-shell py-16 pt-36 sm:pt-40 lg:py-24 lg:pt-44">
        <header className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p>
        </header>

        {!decision.allowed ? (
          <div className="mt-10 max-w-3xl rounded-[2rem] border border-[#dccca9] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0f4738] text-[#e9cd8a]"><LockKeyhole className="size-6" /></div>
            <h2 className="mt-5 font-display text-2xl font-medium">{copy.lockedTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.lockedDescription}</p>
          </div>
        ) : null}

        <section className="mt-12">
          <h2 className="font-display text-3xl font-medium">{copy.workflowTitle}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {copy.workflow.map((item, index) => {
              const Icon = icons[item.icon];
              return <article key={item.title} className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><span className="text-xs font-semibold text-[#98772f]">0{index + 1}</span><Icon className="mt-4 size-5 text-[#98772f]" /><h3 className="mt-4 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-7 text-[#62736d] dark:text-white/60">{item.description}</p></article>;
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]"><FileSpreadsheet className="size-5 text-[#98772f]" /><h2 className="mt-4 font-display text-xl font-medium">{copy.storageTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.storageDescription}</p></article>
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><ShieldCheck className="size-5 text-[#98772f]" /><h2 className="mt-4 font-display text-xl font-medium">{copy.safetyTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.safetyDescription}</p></article>
        </div>
      </section>
    </main>
  );
}
