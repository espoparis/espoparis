import { CTASection } from "@/components/ui/hero-dithering-card";

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
        linkHref: "/courses",
      }}
      callToActions={[
        {
          text: primaryCta,
          href: "/courses",
          variant: "primary",
        },
        {
          text: secondaryCta,
          href: "/auth/register",
          variant: "secondary",
        },
      ]}
      className="full-bleed border-b border-border/60 bg-background"
      compact
    />
  );
}
