import { CalendarClock, FilePenLine, LockKeyhole, Megaphone, Newspaper, Quote, ShieldCheck, Trash2 } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";
import { canCms } from "@/server/content/cms";

type Copy = {
  eyebrow: string; title: string; description: string; lockedTitle: string; lockedDescription: string;
  masterTitle: string; masterDescription: string; editorTitle: string; editorDescription: string;
  modules: Array<{ title: string; description: string; icon: "news" | "activity" | "reflection" | "schedule" }>;
  workflowTitle: string; workflowDescription: string; reflectionTitle: string; reflectionDescription: string; destructiveTitle: string; destructiveDescription: string;
};
const icons = { news: Newspaper, activity: Megaphone, reflection: Quote, schedule: CalendarClock };

export function ContentManagementCenter({ copy, session }: { copy: Copy; session: AuthSession }) {
  const role = session.identity?.role ?? "visitor";
  const canView = canCms(role, "content.view");
  const isMaster = canCms(role, "settings.manage");
  return <main className="full-bleed bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
    <section className="page-shell py-14 sm:py-18 lg:py-24">
      <div className="max-w-4xl"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p><h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p></div>
      {!canView ? <div className="mt-10 max-w-3xl rounded-[2rem] border border-[#dccca9] bg-white p-8 dark:border-white/10 dark:bg-white/[0.04]"><LockKeyhole className="size-6 text-[#98772f]"/><h2 className="mt-5 font-display text-2xl">{copy.lockedTitle}</h2><p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.lockedDescription}</p></div> : <>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{copy.modules.map((m) => { const Icon=icons[m.icon]; return <article key={m.title} className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><Icon className="size-5 text-[#98772f]"/><h2 className="mt-4 text-lg font-semibold">{m.title}</h2><p className="mt-2 text-sm leading-6 text-[#62736d] dark:text-white/60">{m.description}</p></article>})}</div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2"><article className="rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]"><FilePenLine className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.workflowTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.workflowDescription}</p></article><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><Quote className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.reflectionTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.reflectionDescription}</p></article></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2"><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><ShieldCheck className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{isMaster ? copy.masterTitle : copy.editorTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{isMaster ? copy.masterDescription : copy.editorDescription}</p></article><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><Trash2 className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.destructiveTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.destructiveDescription}</p></article></div>
      </>}
    </section>
  </main>;
}
