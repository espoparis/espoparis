import { CTASection } from "@/components/ui/hero-dithering-card";
import { localizePath } from "@/lib/constants/app";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export function AboutHero({
  locale,
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <CTASection
      badge={eyebrow}
      title={title}
      description={description}
      announcementBanner={{
        text: eyebrow,
        linkText: primaryCta,
        linkHref: localizePath(locale, "/contact"),
      }}
      callToActions={[
        {
          text: primaryCta,
          href: localizePath(locale, "/contact"),
          variant: "primary",
        },
        {
          text: secondaryCta,
          href: localizePath(locale, "/"),
          variant: "secondary",
        },
      ]}
      className="full-bleed border-b border-border/60 bg-background"
    />
  );
}
