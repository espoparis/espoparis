import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/json-ld";
import { PageFrame } from "@/components/layout/page-frame";
import { AboutAdvisorySection } from "@/features/marketing/components/about-advisory-section";
import { AboutDistinctivesSection } from "@/features/marketing/components/about-distinctives-section";
import { AboutFacultySection } from "@/features/marketing/components/about-faculty-section";
import { AboutFounderSection } from "@/features/marketing/components/about-founder-section";
import { AboutHero } from "@/features/marketing/components/about-hero";
import { AboutIntroSection } from "@/features/marketing/components/about-intro-section";
import { AboutMethodologySection } from "@/features/marketing/components/about-methodology-section";
import { AboutNetworkSection } from "@/features/marketing/components/about-network-section";
import { AboutObjectivesSection } from "@/features/marketing/components/about-objectives-section";
import { AboutOverviewSection } from "@/features/marketing/components/about-overview-section";
import { AboutProgramsSection } from "@/features/marketing/components/about-programs-section";
import { getAboutContent } from "@/features/marketing/about-content";
import { buildPageMetadata, createWebPageJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "about.seo" });

  return buildPageMetadata({
    locale: params.locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  const content = await getAboutContent(params.locale);

  return (
    <div className="-mt-24 flex flex-1 flex-col md:-mt-28">
      <JsonLd
        data={createWebPageJsonLd({
          locale: params.locale,
          path: "/about",
          title: t("seo.title"),
          description: t("seo.description"),
          type: "AboutPage",
        })}
      />

      <AboutHero
        locale={params.locale}
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        primaryCta={t("sections.heroPrimaryCta")}
        secondaryCta={t("sections.heroSecondaryCta")}
      />

      <PageFrame className="py-10 lg:py-14">
        <section className="section-space">
          <AboutIntroSection
            eyebrow={content.intro.eyebrow}
            title={content.intro.title}
            paragraphs={content.intro.paragraphs}
            pullQuote={content.intro.pullQuote}
          />
        </section>

        <section className="section-space">
          <AboutOverviewSection
            eyebrow={content.overview.eyebrow}
            title={content.overview.title}
            description={content.overview.description}
            cards={content.overview.cards}
          />
        </section>

        <section className="section-space">
          <AboutObjectivesSection
            eyebrow={content.objectives.eyebrow}
            title={content.objectives.title}
            description={content.objectives.description}
            objectives={content.objectives.objectives}
            focusLabel={content.objectives.focusLabel}
            focusAreas={content.objectives.focusAreas}
            noteTitle={content.objectives.noteTitle}
            noteDescription={content.objectives.noteDescription}
          />
        </section>

        <section className="section-space">
          <AboutDistinctivesSection
            eyebrow={content.distinctives.eyebrow}
            title={content.distinctives.title}
            description={content.distinctives.description}
            items={content.distinctives.items}
          />
        </section>

        <section className="section-space">
          <AboutMethodologySection
            eyebrow={content.methodology.eyebrow}
            title={content.methodology.title}
            description={content.methodology.description}
            languagesLabel={content.methodology.languagesLabel}
            channels={content.methodology.channels}
          />
        </section>

        <section className="section-space">
          <AboutProgramsSection
            eyebrow={content.programs.eyebrow}
            title={content.programs.title}
            description={content.programs.description}
            weekendLabel={content.programs.weekendLabel}
            tracks={content.programs.tracks}
            weekendSchool={content.programs.weekendSchools}
          />
        </section>

        <section className="section-space">
          <AboutFounderSection
            eyebrow={content.founder.eyebrow}
            title={content.founder.title}
            description={content.founder.description}
            name={content.founder.name}
            role={content.founder.role}
            photoAlt={content.founder.photoAlt}
            paragraphs={content.founder.paragraphs}
            factsLabel={content.founder.factsLabel}
            facts={content.founder.facts}
          />
        </section>

        <section className="section-space">
          <AboutAdvisorySection
            eyebrow={content.advisoryBoard.eyebrow}
            title={content.advisoryBoard.title}
            description={content.advisoryBoard.description}
            members={content.advisoryBoard.members}
          />
        </section>

        <section className="section-space">
          <AboutFacultySection
            eyebrow={content.faculty.eyebrow}
            title={content.faculty.title}
            description={content.faculty.description}
            languagesLabel={content.faculty.languagesLabel}
            worksLabel={content.faculty.worksLabel}
            photoAltTemplate={content.faculty.photoAltTemplate}
            members={content.faculty.members}
          />
        </section>

        <section className="section-space">
          <AboutNetworkSection
            eyebrow={content.network.eyebrow}
            title={content.network.title}
            description={content.network.description}
            institutes={content.network.institutes}
            note={content.network.note}
          />
        </section>
      </PageFrame>
    </div>
  );
}
