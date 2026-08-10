import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  frameTitle: string;
  fallbackTitle: string;
  fallbackDescription: string;
  openLabel: string;
};

export function RegisterFormSection({
  eyebrow,
  title,
  description,
  frameTitle,
  fallbackTitle,
  fallbackDescription,
  openLabel,
}: Props) {
  return (
    <section id="registration-form" className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="surface-panel overflow-hidden p-2 sm:p-3">
          {/* Google Forms controls its own internal scrolling, so the frame is
              given a tall fixed height rather than trying to auto-size it — a
              cross-origin frame cannot report its content height. */}
          <iframe
            src={siteConfig.registration.embedUrl}
            title={frameTitle}
            loading="lazy"
            className="h-[min(160vh,1500px)] w-full rounded-[1.5rem] border-0 bg-white"
          >
            {fallbackDescription}
          </iframe>
        </div>

        <div className="surface-subtle mx-auto flex max-w-3xl flex-col items-center gap-4 p-6 text-center sm:p-7">
          <div className="space-y-2">
            <p className="public-item-title">{fallbackTitle}</p>
            <p className="public-support-text">{fallbackDescription}</p>
          </div>
          <Button asChild variant="soft" size="lg" className="rounded-full px-7">
            <a
              href={siteConfig.registration.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {openLabel}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
