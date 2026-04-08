import { getTranslations } from "next-intl/server";
import { PageFrame } from "@/components/layout/page-frame";
import { ContactFormSection } from "@/features/marketing/components/contact-form-section";
import { ContactHero } from "@/features/marketing/components/contact-hero";
import { ContactMethodsSection } from "@/features/marketing/components/contact-methods-section";
import { ContactVisitSection } from "@/features/marketing/components/contact-visit-section";
import { siteConfig } from "@/lib/site-config";

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "contact" });

  return (
    <div className="-mt-24 flex flex-1 flex-col md:-mt-28">
      <ContactHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        primaryCta={t("sections.heroPrimaryCta")}
        secondaryCta={t("sections.heroSecondaryCta")}
      />

      <PageFrame className="py-10 lg:py-14">
        <section className="section-space">
          <ContactMethodsSection
            eyebrow={t("sections.methodsEyebrow")}
            title={t("sections.methodsTitle")}
            description={t("sections.methodsDescription")}
            methods={[
              {
                title: t("methods.generalTitle"),
                description: t("methods.generalDescription"),
                value: siteConfig.contact.primaryEmail,
                href: `mailto:${siteConfig.contact.primaryEmail}`,
              },
              {
                title: t("methods.admissionsTitle"),
                description: t("methods.admissionsDescription"),
                value: siteConfig.contact.admissionsEmail,
                href: `mailto:${siteConfig.contact.admissionsEmail}`,
              },
              {
                title: t("methods.phoneTitle"),
                description: t("methods.phoneDescription"),
                value: siteConfig.contact.phone,
                href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
              },
              {
                title: t("methods.visitTitle"),
                description: t("methods.visitDescription"),
                value: t("methods.visitValue"),
                href: "#visit-academy",
              },
            ]}
          />
        </section>

        <section className="section-space">
          <ContactFormSection
            locale={params.locale}
            eyebrow={t("sections.formEyebrow")}
            title={t("sections.formTitle")}
            description={t("sections.formDescription")}
            noteTitle={t("form.noteTitle")}
            noteDescription={t("form.noteDescription")}
            fields={{
              name: t("form.fields.name"),
              email: t("form.fields.email"),
              subject: t("form.fields.subject"),
              message: t("form.fields.message"),
              reason: t("form.fields.reason"),
              reasonOptions: {
                general: t("form.fields.reasonOptions.general"),
                admissions: t("form.fields.reasonOptions.admissions"),
                partnerships: t("form.fields.reasonOptions.partnerships"),
                visit: t("form.fields.reasonOptions.visit"),
              },
              namePlaceholder: t("form.fields.namePlaceholder"),
              emailPlaceholder: t("form.fields.emailPlaceholder"),
              subjectPlaceholder: t("form.fields.subjectPlaceholder"),
              messagePlaceholder: t("form.fields.messagePlaceholder"),
              submit: t("form.fields.submit"),
              pending: t("form.fields.pending"),
            }}
          />
        </section>

        <section className="section-space">
          <ContactVisitSection
            eyebrow={t("sections.visitEyebrow")}
            title={t("sections.visitTitle")}
            description={t("sections.visitDescription")}
            addressLabel={t("visit.addressLabel")}
            addressLines={[
              siteConfig.contact.addressLineOne,
              siteConfig.contact.addressLineTwo,
            ]}
            hoursLabel={t("visit.hoursLabel")}
            hoursLines={[
              siteConfig.contact.visitHoursWeekdays,
              siteConfig.contact.visitHoursSaturday,
            ]}
            noteLabel={t("visit.noteTitle")}
            noteDescription={t("visit.noteDescription")}
          />
        </section>
      </PageFrame>
    </div>
  );
}
