import { getTranslations } from "next-intl/server";
import { PageFrame } from "@/components/layout/page-frame";
import { PublicStatsStrip } from "@/features/marketing/components/public-stats-strip";
import { SetupAlert } from "@/components/shared/setup-alert";
import { AboutClosingSection } from "@/features/marketing/components/about-closing-section";
import { AboutHero } from "@/features/marketing/components/about-hero";
import { AboutValuesGrid } from "@/features/marketing/components/about-values-grid";
import { isSupabaseConfigured } from "@/lib/env";
import { getPublicCatalogStats } from "@/server/queries/marketing";

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "about" });
  const configured = isSupabaseConfigured();
  const stats = configured ? await getPublicCatalogStats() : null;

  return (
    <div className="flex flex-1 flex-col pt-4 lg:pt-6">
      <AboutHero
        locale={params.locale}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        primaryCta={t("sections.heroPrimaryCta")}
        secondaryCta={t("sections.heroSecondaryCta")}
        panelEyebrow={t("sections.heroPanelEyebrow")}
        panelTitle={t("sections.heroPanelTitle")}
        panelDescription={t("sections.heroPanelDescription")}
        items={[
          {
            title: t("foundation.serverFirstTitle"),
            description: t("foundation.serverFirstDescription"),
          },
          {
            title: t("foundation.supabaseTitle"),
            description: t("foundation.supabaseDescription"),
          },
          {
            title: t("foundation.modulesTitle"),
            description: t("foundation.modulesDescription"),
          },
        ]}
      />

      <PageFrame className="py-10 lg:py-14">
        <section className="section-space">
          {!configured ? <SetupAlert /> : null}
          {configured && stats ? <PublicStatsStrip stats={stats} /> : null}
        </section>

        <section className="section-space">
          <AboutValuesGrid
            eyebrow={t("sections.valuesEyebrow")}
            title={t("sections.valuesTitle")}
            description={t("sections.valuesDescription")}
            items={[
            {
              title: t("grid.trustTitle"),
              description: t("grid.trustDescription"),
            },
            {
              title: t("grid.learningTitle"),
              description: t("grid.learningDescription"),
            },
            {
              title: t("grid.durabilityTitle"),
              description: t("grid.durabilityDescription"),
            },
            {
              title: t("grid.polishTitle"),
              description: t("grid.polishDescription"),
            },
            {
              title: t("grid.teamsTitle"),
              description: t("grid.teamsDescription"),
            },
            {
              title: t("grid.changeTitle"),
              description: t("grid.changeDescription"),
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
