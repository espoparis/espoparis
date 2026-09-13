import Image from "next/image";
import { getFacultyImage } from "@/features/marketing/faculty-images";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export type LeadershipMember = { id: string; name: string; role: string; bio: string };

type Props = { eyebrow: string; title: string; description: string; members: LeadershipMember[] };

export function LeadershipSection({ eyebrow, title, description, members }: Props) {
  return <section className="py-8 md:py-12">
    <div className="public-section-stack">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="public-heading-display mt-4">{title}</h2>
        <p className="public-copy-lead mx-auto mt-5 max-w-2xl">{description}</p>
      </Reveal>
      <Stagger className="grid gap-5 lg:grid-cols-3">
        {members.map((member) => {
          const image = getFacultyImage(member.id);
          return <StaggerItem key={member.id}>
            <article className="group overflow-hidden rounded-sm border border-border/65 bg-card">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary/60">
                {image ? <Image src={image} alt={member.name} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]" sizes="(min-width:1024px) 33vw,100vw" /> : null}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#062b22]/90 via-[#062b22]/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#e2c27b]">{member.role}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">{member.name}</h3>
                </div>
              </div>
              <p className="p-6 text-sm leading-7 text-muted-foreground">{member.bio}</p>
            </article>
          </StaggerItem>;
        })}
      </Stagger>
    </div>
  </section>;
}
