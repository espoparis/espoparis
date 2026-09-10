import { BadgeCheck, KeyRound, LockKeyhole, ShieldCheck, UserCog, UsersRound } from "lucide-react";

export type PeopleCopy = {
  eyebrow: string;
  title: string;
  description: string;
  masterTitle: string;
  masterDescription: string;
  liveTitle: string;
  liveDescription: string;
  rolesTitle: string;
  roles: Array<{ title: string; description: string; permissions: string }>;
  lifecycleTitle: string;
  lifecycle: Array<{ title: string; description: string }>;
  safetyTitle: string;
  safetyDescription: string;
};

export function PeoplePermissionsCenter({ copy }: { copy: PeopleCopy }) {
  const icons = [UserCog, BadgeCheck, KeyRound, ShieldCheck, UsersRound];
  return (
    <main className="full-bleed min-h-screen bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
      <section className="page-shell py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[#c8b785] bg-[#eee5cf] p-6 dark:border-[#d5b769]/20 dark:bg-[#d5b769]/[0.08]">
            <ShieldCheck className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl">{copy.masterTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.masterDescription}</p>
          </article>
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <LockKeyhole className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-xl">{copy.liveTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.liveDescription}</p>
          </article>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl">{copy.rolesTitle}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {copy.roles.map((role, index) => {
              const Icon = icons[index] ?? UserCog;
              return <article key={role.title} className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><Icon className="size-5 text-[#98772f]"/><h3 className="mt-4 text-lg font-semibold">{role.title}</h3><p className="mt-2 text-sm leading-6 text-[#62736d] dark:text-white/60">{role.description}</p><p className="mt-4 rounded-xl bg-[#f3efe5] px-3 py-2 text-xs font-semibold text-[#6d5a2c] dark:bg-white/[0.05] dark:text-[#d5b769]">{role.permissions}</p></article>;
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="font-display text-2xl">{copy.lifecycleTitle}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {copy.lifecycle.map((step, index) => <div key={step.title} className="rounded-2xl border border-[#e5d9bd] p-4 dark:border-white/10"><span className="text-xs font-semibold text-[#98772f]">0{index + 1}</span><h3 className="mt-2 font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-6 text-[#62736d] dark:text-white/60">{step.description}</p></div>)}
            </div>
          </article>
          <article className="rounded-[1.75rem] border border-[#c8b785] bg-[#eee5cf] p-6 dark:border-[#d5b769]/20 dark:bg-[#d5b769]/[0.08]">
            <KeyRound className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.safetyTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.safetyDescription}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
