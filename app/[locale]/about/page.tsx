import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/shared/json-ld";
import { PageFrame } from "@/components/layout/page-frame";
import { AboutClosingSection } from "@/features/marketing/components/about-closing-section";
import { AboutHero } from "@/features/marketing/components/about-hero";
import { PhotoGallery } from "@/components/ui/gallery";
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
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        primaryCta={t("sections.heroPrimaryCta")}
        secondaryCta={t("sections.heroSecondaryCta")}
      />

      <PageFrame className="py-10 lg:py-14">
        <section className="section-space">
          <PhotoGallery
            locale={params.locale}
            eyebrow={t("sections.galleryEyebrow")}
            title={t("sections.galleryTitle")}
            description={t("sections.galleryDescription")}
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
          <AboutClosingSection
            eyebrow={t("sections.closingEyebrow")}
            title={t("sections.closingTitle")}
            description={t("sections.closingDescription")}
            items={[
              {
                title: t("closing.phaseOneTitle"),
                description: t("closing.phaseOneDescription"),
              },
              {
                title: t("closing.removedTitle"),
                description: t("closing.removedDescription"),
              },
              {
                title: t("closing.nextTitle"),
                description: t("closing.nextDescription"),
              },
            ]}
          />
        </section>
      </PageFrame>
    </div>
  );
}
