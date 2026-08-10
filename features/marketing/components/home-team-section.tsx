import { TeamSection } from "@/components/ui/team";

export type TeamMemberEntry = {
  name: string;
  role: string;
};

type HomeTeamSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  testimonial: {
    quote: string;
    name: string;
    role: string;
  };
  members: TeamMemberEntry[];
};

export function HomeTeamSection({
  eyebrow,
  title,
  description,
  cta,
  testimonial,
  members,
}: HomeTeamSectionProps) {
  return (
    <TeamSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      cta={cta}
      members={members}
      testimonial={testimonial}
    />
  );
}
