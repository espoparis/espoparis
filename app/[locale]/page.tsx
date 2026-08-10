import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/json-ld";
import { Features } from "@/components/blocks/features-4";
import { PageFrame } from "@/components/layout/page-frame";
import { HomeClosingCta } from "@/features/marketing/components/home-closing-cta";
import { HomeHero } from "@/features/marketing/components/home-hero";
import {
  HomeTeamSection,
  type TeamMemberEntry,
} from "@/features/marketing/components/home-team-section";
import { localizePath } from "@/lib/constants/app";
import { buildPageMetadata, createWebPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const FEATURE_KEYS = [
  "seminaryStudy",
  "multilingualTeaching",
  "teacherFormation",
  "onlineAccess",
  "najafPathway",
  "francophoneReach",
] as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "home.seo" });

  return buildPageMetadata({
    locale: params.locale,
    path: "/",
    title: t("title"),
    description: t("description"),
    absoluteTitle: true,
  });
}

export default async function Home({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: "home" });
  const tNav = await getTranslations({ locale: params.locale, namespace: "common.nav" });

  return (
    <div className="-mt-24 flex flex-1 flex-col md:-mt-28">
      <JsonLd
        data={createWebPageJsonLd({
          locale: params.locale,
          path: "/",
          title: siteConfig.name,
          description: t("seo.description"),
        })}
      />

      <HomeHero
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        primaryCta={{
          label: tNav("about"),
          href: localizePath(params.locale, "/about"),
        }}
        secondaryCta={{
          label: tNav("contact"),
          href: localizePath(params.locale, "/contact"),
        }}
      />

      <PageFrame className="py-3 sm:py-4 lg:py-5">
        <section className="mt-4 sm:mt-5 lg:mt-6">
          <Features
            title={t("featuresSection.title")}
            description={t("featuresSection.description")}
            items={FEATURE_KEYS.map((key) => ({
              title: t(`featuresSection.items.${key}.title`),
              description: t(`featuresSection.items.${key}.description`),
            }))}
          />
        </section>
      </PageFrame>

      <HomeTeamSection
        eyebrow={t("teamSection.eyebrow")}
        title={t("teamSection.title")}
        description={t("teamSection.description")}
        cta={{
          label: t("teamSection.cta"),
          href: localizePath(params.locale, "/about"),
        }}
        members={t.raw("teamSection.members") as TeamMemberEntry[]}
        testimonial={{
          quote: t("teamSection.testimonial.quote"),
          name: t("teamSection.testimonial.name"),
          role: t("teamSection.testimonial.role"),
        }}
      />

      <HomeClosingCta
        badge={t("closingCta.badge")}
        headline={{
          line1: t("closingCta.line1"),
          line2: t("closingCta.line2"),
        }}
        subtitle={t("closingCta.description")}
        primaryCta={{
          label: tNav("register"),
          href: localizePath(params.locale, "/register"),
        }}
        secondaryCta={{
          label: tNav("contact"),
          href: localizePath(params.locale, "/contact"),
        }}
      />
    </div>
  );
}
