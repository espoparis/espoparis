import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/json-ld";
import { HomeHero } from "@/features/marketing/components/home-hero";
import { HomeInstitutionalSections } from "@/features/marketing/components/home-institutional-sections";
import { HomeAccessSection } from "@/features/marketing/components/home-access-section";
import { HomeSupportSection } from "@/features/marketing/components/home-support-section";
import { HomeDailyReflection } from "@/features/marketing/components/home-daily-reflection";
import { getAboutContent } from "@/features/marketing/about-content";
import { localizePath } from "@/lib/constants/app";
import { buildPageMetadata, createWebPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getPublicCmsSnapshot } from "@/server/content/cms-repository";
import { selectDailyReflection } from "@/server/content/cms";



export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: "home.seo" });

  return buildPageMetadata({
    locale: params.locale,
    path: "/",
    title: t("title"),
    description: t("description"),
    absoluteTitle: true,
  });
}

export default async function Home(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: "home" });
  const tNav = await getTranslations({ locale: params.locale, namespace: "common.nav" });
  const aboutContent = await getAboutContent(params.locale);
  const cms = await getPublicCmsSnapshot();
  const dailyReflection = selectDailyReflection(cms.reflections);

  return (
    <div className="flex flex-1 flex-col">
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
        highlights={[
          { label: t("featuresSection.items.seminaryStudy.title") },
          { label: t("featuresSection.items.multilingualTeaching.title") },
          { label: t("featuresSection.items.teacherFormation.title") },
        ]}
        featureTitle={t("featuresSection.title")}
        featureDescription={t("featuresSection.description")}
      />

      <HomeDailyReflection reflection={dailyReflection} locale={params.locale} copy={t.raw("dailyReflection")} />

      <HomeAccessSection locale={params.locale} copy={t.raw("accessSection")} />

      <HomeSupportSection locale={params.locale} copy={t.raw("supportSection")} />

      <HomeInstitutionalSections
        locale={params.locale}
        aboutHref={localizePath(params.locale, "/about")}
        registerHref={localizePath(params.locale, "/register")}
        content={aboutContent}
      />
    </div>
  );
}
