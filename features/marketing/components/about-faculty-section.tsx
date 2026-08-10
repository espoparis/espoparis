import Image from "next/image";
import { BookOpen } from "lucide-react";
import { getFacultyImage } from "@/features/marketing/faculty-images";

export type FacultyMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  languages: string;
  works?: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  languagesLabel: string;
  worksLabel: string;
  photoAltTemplate: string;
  members: FacultyMember[];
};

export function AboutFacultySection({
  eyebrow,
  title,
  description,
  languagesLabel,
  worksLabel,
  photoAltTemplate,
  members,
}: Props) {
  return (
    <section className="py-6 md:py-8">
      <div className="public-section-stack">
        <div className="public-intro-stack mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display mx-auto max-w-[16ch]">{title}</h2>
          <p className="public-copy-lead mx-auto max-w-2xl">{description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {members.map((member) => {
            const image = getFacultyImage(member.id);

            return (
              <article
                key={member.id}
                className="flex flex-col rounded-[2rem] border border-border/65 bg-background/74 p-6 shadow-[0_30px_80px_-56px_hsl(var(--foreground)/0.28)] backdrop-blur-xl sm:p-7"
              >
                <div className="flex items-start gap-4">
                  {image ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card">
                      <Image
                        src={image}
                        alt={photoAltTemplate.replace("{name}", member.name)}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                    >
                      <BookOpen className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0 space-y-1.5 pt-1">
                    <h3 className="text-lg font-semibold leading-7 text-foreground">
                      {member.name}
                    </h3>
                    <p className="public-support-text">{member.role}</p>
                  </div>
                </div>

                <p className="public-card-copy mt-5">{member.bio}</p>

                {member.works?.length ? (
                  <div className="mt-5">
                    <p className="section-eyebrow">{worksLabel}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                      {member.works.map((work) => (
                        <li key={work} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/85" />
                          <span>{work}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-auto border-t border-border/60 pt-5">
                  <p className="section-eyebrow">{languagesLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {member.languages}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
