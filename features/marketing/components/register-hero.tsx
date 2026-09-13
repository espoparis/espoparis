import { CTASection } from "@/components/ui/hero-dithering-card";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export function RegisterHero({
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
        linkHref: "#registration-form",
      }}
      callToActions={[
        { text: primaryCta, href: "#registration-form", variant: "primary" },
        {
          text: secondaryCta,
          href: "/about",
          variant: "secondary",
        },
      ]}
      className="full-bleed border-b border-border/60 bg-background"
    />
  );
}
