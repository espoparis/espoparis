import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/json-ld";
import { PageFrame } from "@/components/layout/page-frame";
import { RegisterFormSection } from "@/features/marketing/components/register-form-section";
import { RegisterHero } from "@/features/marketing/components/register-hero";
import { RegisterProgramsSection } from "@/features/marketing/components/register-programs-section";
import { RegisterStepsSection } from "@/features/marketing/components/register-steps-section";
import { buildPageMetadata, createWebPageJsonLd } from "@/lib/seo";

type ProgramEntry = { title: string; description: string; audience: string };
type StepEntry = { title: string; description: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "register.seo" });

  return buildPageMetadata({
    locale: params.locale,
    path: "/register",
    title: t("title"),
    description: t("description"),
  });
}

export default async function RegisterPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  const t = await getTranslations({ locale: params.locale, namespace: "register" });

  return (
    <div className="-mt-24 flex flex-1 flex-col md:-mt-28">
      <JsonLd
        data={createWebPageJsonLd({
          locale: params.locale,
          path: "/register",
          title: t("seo.title"),
          description: t("seo.description"),
        })}
      />

      <RegisterHero
        locale={params.locale}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        primaryCta={t("sections.heroPrimaryCta")}
        secondaryCta={t("sections.heroSecondaryCta")}
      />

      <PageFrame className="py-10 lg:py-14">
        <section className="section-space">
          <RegisterProgramsSection
            eyebrow={t("programs.eyebrow")}
            title={t("programs.title")}
            description={t("programs.description")}
            audienceLabel={t("programs.audienceLabel")}
            programs={t.raw("programs.items") as ProgramEntry[]}
          />
        </section>

        <section className="section-space">
          <RegisterStepsSection
            eyebrow={t("steps.eyebrow")}
            title={t("steps.title")}
            description={t("steps.description")}
            steps={t.raw("steps.items") as StepEntry[]}
          />
        </section>

        <section className="section-space">
          <RegisterFormSection
            eyebrow={t("form.eyebrow")}
            title={t("form.title")}
            description={t("form.description")}
            frameTitle={t("form.frameTitle")}
            fallbackTitle={t("form.fallbackTitle")}
            fallbackDescription={t("form.fallbackDescription")}
            openLabel={t("form.openLabel")}
          />
        </section>
      </PageFrame>
    </div>
  );
}
