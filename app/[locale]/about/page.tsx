import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/shared/json-ld";
import { PageFrame } from "@/components/layout/page-frame";
import { AboutHero } from "@/features/marketing/components/about-hero";
import { AboutNetworkSection } from "@/features/marketing/components/about-network-section";
import { AboutOverviewSection } from "@/features/marketing/components/about-overview-section";
import { AboutProgramsSection } from "@/features/marketing/components/about-programs-section";
import { AboutScholarsSection } from "@/features/marketing/components/about-scholars-section";
import { PhotoGallery } from "@/components/ui/gallery";
import { aboutSeminaryContent } from "@/content/about-seminary";
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
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  const content = aboutSeminaryContent;

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
          <AboutOverviewSection
            eyebrow={content.overview.eyebrow}
            title={content.overview.title}
            description={content.overview.description}
            cards={[...content.overview.cards]}
          />
        </section>

        <section className="section-space">
          <PhotoGallery
            locale={params.locale}
            eyebrow={content.gallery.eyebrow}
            title={content.gallery.title}
            description={content.gallery.description}
            ctaLabel={t("sections.galleryCta")}
            ctaHref="/contact"
            images={[
              {
                src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
                alt: t("gallery.imageOneAlt"),
              },
              {
                src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
                alt: t("gallery.imageTwoAlt"),
              },
              {
                src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
                alt: t("gallery.imageThreeAlt"),
              },
              {
                src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
                alt: t("gallery.imageFourAlt"),
              },
              {
                src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
                alt: t("gallery.imageFiveAlt"),
              },
            ]}
          />
        </section>

        <section className="section-space">
          <AboutProgramsSection
            eyebrow={content.programs.eyebrow}
            title={content.programs.title}
            description={content.programs.description}
            tracks={[...content.programs.tracks]}
            weekendSchool={content.programs.weekendSchools}
          />
        </section>

        <section className="section-space">
          <AboutScholarsSection
            eyebrow={content.leadership.eyebrow}
            title={content.leadership.title}
            description={content.leadership.description}
            founder={content.leadership.founder}
            advisoryBoard={content.leadership.advisoryBoard}
            faculty={content.leadership.faculty}
          />
        </section>

        <section className="section-space">
          <AboutNetworkSection
            eyebrow={content.network.eyebrow}
            title={content.network.title}
            description={content.network.description}
            institutes={[...content.network.institutes]}
            note={content.network.note}
          />
        </section>
      </PageFrame>
    </div>
  );
}
