import AnimatedShaderHero from "@/components/ui/animated-shader-hero";

type Props = {
  badge: string;
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export function HomeClosingCta({
  badge,
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <AnimatedShaderHero
      trustBadge={{ text: badge }}
      headline={headline}
      subtitle={subtitle}
      buttons={{
        primary: {
          text: primaryCta.label,
          href: primaryCta.href,
        },
        secondary: {
          text: secondaryCta.label,
          href: secondaryCta.href,
        },
      }}
      className="full-bleed"
    />
  );
}
