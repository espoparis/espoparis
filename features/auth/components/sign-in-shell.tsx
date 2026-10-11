import Link from "next/link";
import { CheckCircle2, KeyRound, ShieldCheck, UserRoundCheck } from "lucide-react";
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

const adminCopy: Record<string, { title: string; description: string; back: string }> = {
  ar: { title: "دخول الإدارة", description: "سجّل الدخول بحسابك المعتمد لإدارة المركز. تُحدَّد صلاحيات الوصول بحسب حسابك.", back: "العودة إلى الموقع" },
  en: { title: "Administration sign-in", description: "Sign in with your authorized account to manage the Center. Access depends on your account permissions.", back: "Return to the website" },
  fr: { title: "Connexion à l’administration", description: "Connectez-vous avec votre compte autorisé pour gérer le Centre. L’accès dépend des permissions de votre compte.", back: "Retour au site" },
  fa: { title: "ورود به مدیریت", description: "برای مدیریت مرکز با حساب مجاز خود وارد شوید. دسترسی بر اساس مجوزهای حساب شما تعیین می‌شود.", back: "بازگشت به وب‌سایت" },
};

export function SignInShell({ copy, readiness, locale, returnTo, adminMode = false }: { copy: SignInCopy; readiness: AuthProviderReadiness; locale: string; returnTo?: string; adminMode?: boolean }) {
  const admin = adminCopy[locale] ?? adminCopy.en;
  return (
    <div className="page-shell pb-24 pt-36 sm:pt-40 lg:pb-32 lg:pt-44">
      <header className="mx-auto max-w-4xl text-center">
        <p className="section-eyebrow">{adminMode ? admin.title : copy.eyebrow}</p>
        <h1 className="mt-5 font-display text-[clamp(3rem,7vw,5.6rem)] font-medium leading-[.96] tracking-[-.05em]">{adminMode ? admin.title : copy.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{adminMode ? admin.description : copy.description}</p>
      </header>

      <section className={`mx-auto mt-12 grid max-w-5xl gap-6 ${adminMode ? "lg:max-w-xl" : "lg:grid-cols-[1.05fr_.95fr]"}`}>
        <div className="rounded-[2rem] border border-border bg-card p-7 shadow-sm sm:p-9">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><KeyRound className="size-5" /></div>
          {readiness.google ? (
            <Link href={`/api/auth/google/start?locale=${encodeURIComponent(locale)}&returnTo=${encodeURIComponent(returnTo ?? `/${locale}/student`)}`} className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
              <UserRoundCheck className="size-4" />{copy.googleLabel}
            </Link>
          ) : (
            <button type="button" disabled className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-45">
              <UserRoundCheck className="size-4" />{copy.googleLabel}
            </button>
          )}
          {!readiness.google ? <p className="mt-2 text-center text-xs text-muted-foreground">{copy.unavailable}</p> : null}

          {/* Email sign-in is hidden until a verified token flow is implemented. */}

        </div>

        {!adminMode ? <aside className="rounded-[2rem] border border-border bg-secondary/35 p-7 sm:p-9">
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
        </aside> : null}
      </section>

      <div className="mt-8 text-center"><Link href={adminMode ? `/${locale}` : `/${locale}/student`} className="text-sm font-semibold text-primary hover:underline">{adminMode ? admin.back : copy.backLabel}</Link></div>
    </div>
  );
}
