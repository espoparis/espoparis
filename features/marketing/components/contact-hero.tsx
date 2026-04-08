import { CTASection } from "@/components/ui/hero-dithering-card";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export function ContactHero({
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
        linkHref: "#contact-methods",
      }}
      callToActions={[
        { text: primaryCta, href: "#contact-methods", variant: "primary" },
        { text: secondaryCta, href: "#visit-academy", variant: "secondary" },
      ]}
      className="full-bleed border-b border-border/60 bg-background"
    />
  );
}
