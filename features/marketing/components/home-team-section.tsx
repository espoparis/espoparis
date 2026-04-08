import { TeamSection, type TeamMember } from "@/components/ui/team";

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
  members: Array<{
    name: string;
    role: string;
  }>;
};

const memberImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
];

const testimonialImage =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80";

export function HomeTeamSection({
  eyebrow,
  title,
  description,
  cta,
  testimonial,
  members,
}: HomeTeamSectionProps) {
  const people: TeamMember[] = members.map((member, index) => ({
    ...member,
    image: memberImages[index % memberImages.length],
    imageAlt: `${member.name} portrait`,
  }));

  return (
    <TeamSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      cta={cta}
      members={people}
      testimonial={{
        ...testimonial,
        image: testimonialImage,
        imageAlt: `${testimonial.name} portrait`,
      }}
    />
  );
}
