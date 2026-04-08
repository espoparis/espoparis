import { getTranslations } from "next-intl/server";
import { Github, Twitter } from "lucide-react";
import { SiteBrand } from "@/components/shared/site-brand";
import { Footer } from "@/components/ui/footer";
import { publicNavLinks } from "@/lib/constants/app";
import { localizePath } from "@/lib/constants/app";
import { siteConfig } from "@/lib/site-config";

type Props = {
  locale: string;
};

export async function SiteFooter({ locale }: Props) {
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tFooter = await getTranslations({ locale, namespace: "shell.footer" });

  return (
    <div data-site-footer>
      <Footer
        brand={<SiteBrand variant="full" size="md" />}
        description={`${tFooter("title")} ${tFooter("description")}`}
        socialLinks={[
          {
            icon: <Twitter className="h-4 w-4" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Github className="h-4 w-4" />,
            href: "https://github.com",
            label: "GitHub",
          },
        ]}
        mainLinksTitle={tCommon("labels.navigate")}
        mainLinks={publicNavLinks.map((link) => ({
          href: localizePath(locale, link.href),
          label: tCommon(`nav.${link.key}`),
        }))}
        legalLinksTitle={tCommon("labels.connect")}
        legalLinks={[
          {
            href: `mailto:${siteConfig.contact.primaryEmail}`,
            label: siteConfig.contact.primaryEmail,
          },
          {
            href: `tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`,
            label: siteConfig.contact.phone,
          },
        ]}
        copyright={{
          text: `© ${new Date().getFullYear()} ${siteConfig.name}`,
          license: "All rights reserved",
        }}
        className="full-bleed"
      />
    </div>
  );
}
