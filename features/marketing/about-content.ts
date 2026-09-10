import { getTranslations } from "next-intl/server";
import type { AdvisoryMember } from "@/features/marketing/components/about-advisory-section";
import type { Distinctive } from "@/features/marketing/components/about-distinctives-section";
import type { FacultyMember } from "@/features/marketing/components/about-faculty-section";
import type { Institute } from "@/features/marketing/components/about-network-section";
import type { LeadershipMember } from "@/features/marketing/components/leadership-section";

export type OverviewCard = {
  title: string;
  description: string;
};

export type ProgramTrack = {
  title: string;
  description: string;
  points: string[];
};

export type MethodologyChannel = {
  title: string;
  description: string;
  languages: string;
};

export type FounderFact = {
  label: string;
  value: string;
};

/**
 * Reads the About page copy out of `messages/<locale>.json`.
 *
 * List-shaped content (cards, tracks, faculty, institutes) is stored as JSON
 * arrays, which next-intl exposes through `t.raw`. `raw` is untyped by design,
 * so the casts here are the single place where that shape is asserted.
 */
export async function getAboutContent(locale: string) {
  const t = await getTranslations({ locale, namespace: "about.content" });

  return {
    hero: {
      eyebrow: t("hero.eyebrow"),
      title: t("hero.title"),
      description: t("hero.description"),
    },
    intro: {
      eyebrow: t("intro.eyebrow"),
      title: t("intro.title"),
      pullQuote: t("intro.pullQuote"),
      paragraphs: t.raw("intro.paragraphs") as string[],
    },
    overview: {
      eyebrow: t("overview.eyebrow"),
      title: t("overview.title"),
      description: t("overview.description"),
      cards: t.raw("overview.cards") as OverviewCard[],
    },
    objectives: {
      eyebrow: t("objectives.eyebrow"),
      title: t("objectives.title"),
      description: t("objectives.description"),
      focusLabel: t("objectives.focusLabel"),
      noteTitle: t("objectives.noteTitle"),
      noteDescription: t("objectives.noteDescription"),
      objectives: t.raw("objectives.items") as string[],
      focusAreas: t.raw("objectives.focusAreas") as string[],
    },
    distinctives: {
      eyebrow: t("distinctives.eyebrow"),
      title: t("distinctives.title"),
      description: t("distinctives.description"),
      items: t.raw("distinctives.items") as Distinctive[],
    },
    methodology: {
      eyebrow: t("methodology.eyebrow"),
      title: t("methodology.title"),
      description: t("methodology.description"),
      languagesLabel: t("methodology.languagesLabel"),
      channels: t.raw("methodology.channels") as MethodologyChannel[],
    },
    programs: {
      eyebrow: t("programs.eyebrow"),
      title: t("programs.title"),
      description: t("programs.description"),
      weekendLabel: t("programs.weekendLabel"),
      tracks: t.raw("programs.tracks") as ProgramTrack[],
      weekendSchools: t.raw("programs.weekendSchools") as ProgramTrack,
    },
    founder: {
      eyebrow: t("founder.eyebrow"),
      title: t("founder.title"),
      description: t("founder.description"),
      name: t("founder.name"),
      role: t("founder.role"),
      photoAlt: t("founder.photoAlt"),
      factsLabel: t("founder.factsLabel"),
      paragraphs: t.raw("founder.paragraphs") as string[],
      facts: t.raw("founder.facts") as FounderFact[],
    },
    leadership: {
      eyebrow: t("leadership.eyebrow"),
      title: t("leadership.title"),
      description: t("leadership.description"),
      members: t.raw("leadership.members") as LeadershipMember[],
    },
    advisoryBoard: {
      eyebrow: t("advisoryBoard.eyebrow"),
      title: t("advisoryBoard.title"),
      description: t("advisoryBoard.description"),
      members: t.raw("advisoryBoard.members") as AdvisoryMember[],
    },
    faculty: {
      eyebrow: t("faculty.eyebrow"),
      title: t("faculty.title"),
      description: t("faculty.description"),
      languagesLabel: t("faculty.languagesLabel"),
      worksLabel: t("faculty.worksLabel"),
      // `raw` on purpose: the message contains a literal `{name}` that the
      // component substitutes per member. Reading it with `t()` would make
      // next-intl treat it as an ICU argument and fail to resolve the key.
      photoAltTemplate: t.raw("faculty.photoAltTemplate") as string,
      members: t.raw("faculty.members") as FacultyMember[],
    },
    network: {
      eyebrow: t("network.eyebrow"),
      title: t("network.title"),
      description: t("network.description"),
      note: t("network.note"),
      institutes: t.raw("network.institutes") as Institute[],
    },
  };
}

export type AboutContent = Awaited<ReturnType<typeof getAboutContent>>;
