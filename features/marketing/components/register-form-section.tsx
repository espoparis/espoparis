import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  openLabel: string;
};

export function RegisterFormSection({ locale, eyebrow, title, description, openLabel }: Props) {
  const forms = [...siteConfig.registration.forms].sort(
    (a, b) => Number(b.locale === locale) - Number(a.locale === locale),
  );

  return (
    <section id="registration-form" className="scroll-mt-32 py-6 md:py-8">
      <div className="public-section-stack mx-auto max-w-4xl">
        <div className="public-intro-stack max-w-3xl">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display">{title}</h2>
          <p className="public-copy-lead">{description}</p>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {forms.map((form) => (
            <li key={form.locale}>
              <a
                href={form.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 transition-colors hover:bg-secondary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${form.locale === locale ? "border-s-2 border-primary bg-secondary/30" : ""}`}
              >
                <span lang={form.locale} dir={form.dir} className="text-xl font-medium">{form.label}</span>
                <span className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground">
                  <span>{openLabel}</span>
                  <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
