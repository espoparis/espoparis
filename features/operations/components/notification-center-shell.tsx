import { Bell, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import type { AuthSession } from "@/server/auth/types";

export type NotificationCenterCopy = {
  eyebrow: string;
  title: string;
  description: string;
  lockedTitle: string;
  lockedDescription: string;
  inAppTitle: string;
  inAppDescription: string;
  emailTitle: string;
  emailDescription: string;
  safetyTitle: string;
  safetyDescription: string;
};

export function NotificationCenterShell({ copy, session }: { copy: NotificationCenterCopy; session: AuthSession }) {
  const signedIn = session.authenticated && session.identity;

  return (
    <main className="full-bleed bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
      <section className="page-shell py-16 pt-36 sm:pt-40 lg:py-24 lg:pt-44">
        <header className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p>
        </header>

        {!signedIn ? (
          <article className="mt-10 max-w-3xl rounded-[2rem] border border-[#dccca9] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <LockKeyhole className="size-6 text-[#98772f]" />
            <h2 className="mt-5 font-display text-2xl font-medium">{copy.lockedTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.lockedDescription}</p>
          </article>
        ) : null}

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <Bell className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-2xl font-medium">{copy.inAppTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.inAppDescription}</p>
          </article>
          <article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <Mail className="size-5 text-[#98772f]" />
            <h2 className="mt-4 font-display text-2xl font-medium">{copy.emailTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.emailDescription}</p>
          </article>
        </section>

        <article className="mt-5 max-w-4xl rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]">
          <ShieldCheck className="size-5 text-[#98772f]" />
          <h2 className="mt-4 font-display text-xl font-medium">{copy.safetyTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.safetyDescription}</p>
        </article>
      </section>
    </main>
  );
}
