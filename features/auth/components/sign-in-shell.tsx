import Link from "next/link";
import { CheckCircle2, KeyRound, Mail, ShieldCheck, UserRoundCheck } from "lucide-react";
import type { AuthProviderReadiness } from "@/server/auth/providers";

export type SignInCopy = {
  eyebrow: string;
  title: string;
  description: string;
  googleLabel: string;
  magicTitle: string;
  magicDescription: string;
  emailPlaceholder: string;
  emailButton: string;
  unavailable: string;
  securityTitle: string;
  securityDescription: string;
  flowTitle: string;
  flow: string[];
  studentNote: string;
  memberNote: string;
  backLabel: string;
};

export function SignInShell({ copy, readiness, locale }: { copy: SignInCopy; readiness: AuthProviderReadiness; locale: string }) {
  return (
    <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
      <header className="mx-auto max-w-4xl text-center">
        <p className="section-eyebrow">{copy.eyebrow}</p>
        <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-medium leading-[.96] tracking-[-.05em]">{copy.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p>
      </header>

      <section className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm sm:p-9">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><KeyRound className="size-5" /></div>
          {readiness.google ? (
            <Link href={`/api/auth/google/start?locale=${encodeURIComponent(locale)}&returnTo=${encodeURIComponent(`/${locale}/student`)}`} className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
              <UserRoundCheck className="size-4" />{copy.googleLabel}
            </Link>
          ) : (
            <button type="button" disabled className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45">
              <UserRoundCheck className="size-4" />{copy.googleLabel}
            </button>
          )}
          {!readiness.google ? <p className="mt-2 text-center text-xs text-muted-foreground">{copy.unavailable}</p> : null}

          <div className="my-7 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-muted-foreground"><span className="h-px flex-1 bg-border" /><span>Email</span><span className="h-px flex-1 bg-border" /></div>
          <h2 className="font-display text-2xl font-semibold">{copy.magicTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.magicDescription}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-4"><Mail className="size-4 text-muted-foreground" /><input disabled={!readiness.magicLink} type="email" placeholder={copy.emailPlaceholder} className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed" /></label>
            <button type="button" disabled={!readiness.magicLink} className="rounded-full border border-primary/30 px-5 py-3 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-45">{copy.emailButton}</button>
          </div>
          {!readiness.magicLink ? <p className="mt-2 text-xs text-muted-foreground">{copy.unavailable}</p> : null}
        </div>

        <aside className="rounded-[2rem] border border-border bg-secondary/35 p-7 sm:p-9">
          <ShieldCheck className="size-7 text-primary" />
          <h2 className="mt-5 font-display text-2xl font-semibold">{copy.securityTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.securityDescription}</p>
          <h3 className="mt-7 text-sm font-semibold">{copy.flowTitle}</h3>
          <ol className="mt-4 space-y-3">
            {copy.flow.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span><span>{item}</span></li>)}
          </ol>
          <div className="mt-7 space-y-3 text-xs leading-6 text-muted-foreground">
            <p className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />{copy.studentNote}</p>
            <p className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />{copy.memberNote}</p>
          </div>
        </aside>
      </section>

      <div className="mt-8 text-center"><Link href={`/${locale}/student`} className="text-sm font-semibold text-primary hover:underline">{copy.backLabel}</Link></div>
    </div>
  );
}
