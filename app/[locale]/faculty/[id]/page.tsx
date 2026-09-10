import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, BookOpen, Languages } from "lucide-react";
import { getAboutContent } from "@/features/marketing/about-content";
import { getFacultyImage } from "@/features/marketing/faculty-images";
import { Link } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(props: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const content = await getAboutContent(params.locale);
  const member = content.faculty.members.find((item) => item.id === params.id);
  if (!member) return {};
  return buildPageMetadata({ locale: params.locale, path: `/faculty/${params.id}`, title: member.name, description: member.bio });
}

export default async function FacultyProfilePage(props: { params: Promise<{ locale: string; id: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const content = await getAboutContent(params.locale);
  const member = content.faculty.members.find((item) => item.id === params.id);
  if (!member) notFound();
  const image = getFacultyImage(member.id);

  return <main className="page-shell pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-40">
    <div className="mx-auto max-w-6xl">
      <Link href="/faculty" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {content.faculty.eyebrow}
      </Link>
      <section className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[2.2rem] border border-border/60 bg-card shadow-[0_36px_90px_-58px_hsl(var(--foreground)/0.42)]">
            <div className="relative aspect-[4/5] bg-secondary/50">
              {image ? <Image src={image} alt={content.faculty.photoAltTemplate.replace("{name}", member.name)} fill priority className="object-cover object-top" sizes="(max-width:1024px) 100vw, 40vw" /> : <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="size-12 text-primary/30" /></div>}
            </div>
          </div>
        </div>
        <div>
          <p className="section-eyebrow">{content.faculty.eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[.96] tracking-[-.05em]">{member.name}</h1>
          <p className="mt-5 text-lg font-medium text-primary">{member.role}</p>
          <div className="mt-8 rounded-[2rem] border border-border/65 bg-background/80 p-6 sm:p-8">
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">{member.bio}</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/60 bg-card/80 p-5">
              <Languages className="size-5 text-primary" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[.16em] text-primary">{content.faculty.languagesLabel}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{member.languages}</p>
            </div>
            {member.works?.length ? <div className="rounded-[1.6rem] border border-border/60 bg-card/80 p-5 sm:col-span-1">
              <BookOpen className="size-5 text-primary" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[.16em] text-primary">{content.faculty.worksLabel}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">{member.works.map((work) => <li key={work}>{work}</li>)}</ul>
            </div> : null}
          </div>
        </div>
      </section>
    </div>
  </main>;
}
