import Image from "next/image";
import { BookOpen } from "lucide-react";
import { getFacultyImage } from "@/features/marketing/faculty-images";
import { Link } from "@/lib/navigation";
import type { FacultyMember } from "@/features/marketing/components/about-faculty-section";

type Props = { members: FacultyMember[]; languagesLabel: string; worksLabel: string; photoAltTemplate: string };

export function FacultyDirectory({ members, languagesLabel, worksLabel, photoAltTemplate }: Props) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {members.map((member) => {
        const image = member.image || getFacultyImage(member.id);
        return (
          <article key={member.id} className="grid min-w-0 gap-8 py-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14 lg:py-14">
            <Link href={`/faculty/${member.id}`} className="relative block aspect-[4/5] w-full max-w-sm overflow-hidden bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {image ? (
                <Image src={image} unoptimized={image.startsWith("/api/content-media/")} alt={photoAltTemplate.replace("{name}", member.name)} fill className="editorial-portrait object-cover object-top" sizes="(min-width:1280px) 384px,(min-width:640px) 30vw,90vw" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center"><BookOpen aria-hidden="true" className="size-10 text-primary/35" /><span className="sr-only">{member.name}</span></span>
              )}
            </Link>
            <div className="min-w-0 self-center">
              <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl"><Link href={`/faculty/${member.id}`} className="decoration-primary/40 underline-offset-8 hover:underline">{member.name}</Link></h2>
              <p className="mt-3 text-sm leading-6 text-primary">{member.role}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">{member.bio}</p>
              <dl className="mt-6 border-t border-border pt-5">
                <dt className="text-sm font-semibold">{languagesLabel}</dt>
                <dd className="mt-2 text-sm leading-7 text-muted-foreground">{member.languages}</dd>
              </dl>
              {member.works?.length ? (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold">{worksLabel}</h3>
                  <ul className="mt-3 list-disc space-y-2 ps-5 text-sm leading-7 text-muted-foreground">
                    {member.works.map((work) => <li key={work}>{work}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
