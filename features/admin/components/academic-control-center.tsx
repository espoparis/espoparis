import { BookOpenCheck, DatabaseZap, FileClock, GraduationCap, LockKeyhole, ReceiptText, ShieldCheck, UsersRound } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { canUseAcademicWorkspace } from "@/server/auth/policy";

type ModuleIcon = "students" | "curriculum" | "grades" | "progression" | "payments" | "data" | "audit" | "roles";

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  lockedTitle: string;
  lockedDescription: string;
  modules: Array<{ title: string; description: string; icon: ModuleIcon }>;
  versioningTitle: string;
  versioningDescription: string;
  operationsTitle: string;
  operationsDescription: string;
  safetyTitle: string;
  safetyDescription: string;
};

const icons = {
  students: UsersRound,
  curriculum: BookOpenCheck,
  grades: GraduationCap,
  progression: GraduationCap,
  payments: ReceiptText,
  data: DatabaseZap,
  audit: FileClock,
  roles: ShieldCheck,
};

export function AcademicControlCenter({ copy, session }: { copy: Copy; session: AuthSession }) {
  const decision = canUseAcademicWorkspace(session, "admin");

  return (
    <main className="full-bleed bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
      <section className="page-shell py-14 sm:py-18 lg:py-24">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p>
        </div>

        {!decision.allowed ? (
          <div className="mt-10 max-w-3xl rounded-[2rem] border border-[#dccca9] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0f4738] text-[#e9cd8a]"><LockKeyhole className="size-6" /></div>
            <h2 className="mt-5 font-display text-2xl font-medium">{copy.lockedTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.lockedDescription}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {copy.modules.map((module) => {
              const Icon = icons[module.icon];
              return <article key={module.title} className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><Icon className="size-5 text-[#98772f]" /><h2 className="mt-4 text-lg font-semibold">{module.title}</h2><p className="mt-2 text-sm leading-6 text-[#62736d] dark:text-white/60">{module.description}</p></article>;
            })}
          </div>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]">
            <BookOpenCheck className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl font-medium">{copy.versioningTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.versioningDescription}</p>
          </article>
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <DatabaseZap className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl font-medium">{copy.operationsTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.operationsDescription}</p>
          </article>
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <ShieldCheck className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl font-medium">{copy.safetyTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.safetyDescription}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
