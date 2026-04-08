import { CTASection } from "@/components/ui/hero-dithering-card";

type Props = {
  badge: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export function HomeHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <CTASection
      badge={badge}
      title={title}
      description={description}
      announcementBanner={{
        text: badge,
        linkText: primaryCta.label,
        linkHref: primaryCta.href,
      }}
      callToActions={[
        { text: primaryCta.label, href: primaryCta.href, variant: "primary" },
        {
          text: secondaryCta.label,
          href: secondaryCta.href,
          variant: "secondary",
        },
      ]}
    />
  );
}
