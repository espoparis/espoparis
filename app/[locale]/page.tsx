import { getTranslations } from "next-intl/server";
import { Features } from "@/components/blocks/features-4";
import { PageFrame } from "@/components/layout/page-frame";
import { HomeClosingCta } from "@/features/marketing/components/home-closing-cta";
import { HomeHero } from "@/features/marketing/components/home-hero";
import { localizePath } from "@/lib/constants/app";

export default async function Home({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "home" });
  const tNav = await getTranslations({ locale: params.locale, namespace: "common.nav" });

  return (
    <div className="-mt-24 flex flex-1 flex-col md:-mt-28">
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
            items={[
              {
                title: t("featuresSection.items.speed.title"),
                description: t("featuresSection.items.speed.description"),
              },
              {
                title: t("featuresSection.items.power.title"),
                description: t("featuresSection.items.power.description"),
              },
              {
                title: t("featuresSection.items.security.title"),
                description: t("featuresSection.items.security.description"),
              },
              {
                title: t("featuresSection.items.customization.title"),
                description: t("featuresSection.items.customization.description"),
              },
              {
                title: t("featuresSection.items.control.title"),
                description: t("featuresSection.items.control.description"),
              },
              {
                title: t("featuresSection.items.aiReady.title"),
                description: t("featuresSection.items.aiReady.description"),
              },
            ]}
          />
        </section>
      </PageFrame>

      <HomeClosingCta
        badge={t("closingCta.badge")}
        headline={{
          line1: t("closingCta.line1"),
          line2: t("closingCta.line2"),
        }}
        subtitle={t("closingCta.description")}
        primaryCta={{
          label: tNav("contact"),
          href: localizePath(params.locale, "/contact"),
        }}
        secondaryCta={{
          label: tNav("about"),
          href: localizePath(params.locale, "/about"),
        }}
      />
    </div>
  );
}
