import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";
import { InstitutionalGeometry } from "@/features/marketing/components/institutional-geometry";

interface CallToAction { text: string; href: string; variant: "primary" | "secondary"; }
interface AnnouncementBanner { text: string; linkText: string; linkHref: string; }
interface CTASectionProps {
  badge: string; title: string; description: string; callToActions: CallToAction[];
  announcementBanner?: AnnouncementBanner; className?: string; compact?: boolean;
}

// Retain the shared export for existing callers; the decorative shader is now
// restrained line geometry without a WebGL or continuous-motion requirement.
export function HeroDitheringBackdrop({ className }: { className?: string; hovered?: boolean }) {
  return <InstitutionalGeometry className={`pointer-events-none absolute -end-12 top-8 w-72 text-primary/10 ${className ?? ""}`} />;
}

export function CTASection({ badge, title, description, callToActions, announcementBanner, className, compact = false }: CTASectionProps) {
  return (
    <section className={`relative isolate overflow-hidden ${className ?? ""}`}>
      <HeroDitheringBackdrop />
      <div className={`page-shell relative ${compact ? "py-14 lg:py-20" : "py-16 lg:py-24"}`}>
        <p className="section-eyebrow">{badge}</p>
        <h1 className="public-heading-hero mt-6 max-w-5xl">{title}</h1>
        <div className="mt-9 editorial-layout">
          <p className="public-copy-lead max-w-2xl">{description}</p>
          <div className="flex flex-wrap items-start gap-5 lg:justify-end">
            {callToActions.map((cta) => <Link key={cta.text} href={cta.href} className={cta.variant === "primary" ? "inline-flex min-h-12 items-center gap-3 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90" : "inline-flex min-h-12 items-center gap-3 border-b border-primary/40 py-3 text-sm font-medium text-primary hover:border-primary"}>{cta.text}<ArrowRight aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" /></Link>)}
          </div>
        </div>
        {announcementBanner && !callToActions.some((cta) => cta.href === announcementBanner.linkHref) ? <Link href={announcementBanner.linkHref} className="mt-6 inline-block text-sm text-primary underline underline-offset-4">{announcementBanner.text} · {announcementBanner.linkText}</Link> : null}
      </div>
    </section>
  );
}
export type { CTASectionProps };
