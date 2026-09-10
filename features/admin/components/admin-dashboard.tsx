import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Library,
  LockKeyhole,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { localizePath } from "@/lib/constants/app";
import type { AdminModule, AdminModuleKey } from "@/server/admin/dashboard";

const icons: Record<AdminModuleKey, typeof Newspaper> = {
  content: Newspaper,
  academic: GraduationCap,
  library: Library,
  learning: BookOpen,
  people: Users,
  settings: Settings,
};

type ModuleCopy = { title: string; description: string };
type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  signedInAs: string;
  role: { master: string; editor: string; academic: string; staff: string };
  statusTitle: string;
  statusDescription: string;
  liveDataTitle: string;
  liveDataDescription: string;
  modulesTitle: string;
  modulesDescription: string;
  open: string;
  foundation: string;
  locked: string;
  modules: Record<AdminModuleKey, ModuleCopy>;
};

export function AdminDashboard({
  copy,
  locale,
  email,
  roleLabel,
  modules,
}: {
  copy: Copy;
  locale: string;
  email: string;
  roleLabel: keyof Copy["role"];
  modules: AdminModule[];
}) {
  return (
    <main className="full-bleed min-h-screen bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
      <section className="page-shell py-10 sm:py-14 lg:py-18">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#98772f]">
              <LayoutDashboard className="size-4" />
              <span>{copy.eyebrow}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p>
          </div>

          <div className="rounded-[1.5rem] border border-[#dccca9] bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8b7c5a] dark:text-white/45">{copy.signedInAs}</p>
            <p className="mt-2 text-sm font-semibold">{email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#102c24] px-3 py-1.5 text-xs font-semibold text-white dark:bg-[#d5b769] dark:text-[#102c24]">
              <ShieldCheck className="size-3.5" />
              {copy.role[roleLabel]}
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[#c8b785] bg-[#eee5cf] p-6 dark:border-[#d5b769]/20 dark:bg-[#d5b769]/[0.08]">
            <ShieldCheck className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl">{copy.statusTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.statusDescription}</p>
          </article>
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <LockKeyhole className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl">{copy.liveDataTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.liveDataDescription}</p>
          </article>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl">{copy.modulesTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.modulesDescription}</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = icons[module.key];
            const item = copy.modules[module.key];
            const enabled = module.state !== "locked";
            const card = (
              <article className="group h-full rounded-[1.75rem] border border-[#dccca9] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#f0eadb] text-[#98772f] dark:bg-white/[0.06]">
                    <Icon className="size-5" />
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${module.state === "available" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200" : module.state === "foundation" ? "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200" : "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/45"}`}>
                    {module.state === "available" ? copy.open : module.state === "foundation" ? copy.foundation : copy.locked}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#62736d] dark:text-white/60">{item.description}</p>
                {module.state === "available" && (
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#7e6428] dark:text-[#d5b769]">
                    <span>{copy.open}</span><ChevronRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </div>
                )}
              </article>
            );

            return enabled && module.state === "available" ? (
              <Link key={module.key} href={localizePath(locale, module.href)} className="block">{card}</Link>
            ) : <div key={module.key}>{card}</div>;
          })}
        </div>
      </section>
    </main>
  );
}
