import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SiteBrand } from "@/components/shared/site-brand";
import { publicNavLinks, localizePath } from "@/lib/constants/app";
import { Link } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

type Props = {
  locale: string;
};

export async function SiteFooter({ locale }: Props) {
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tFooter = await getTranslations({ locale, namespace: "shell.footer" });
  const primaryPhone = locale === "en"
    ? siteConfig.contact.phones.en
    : locale === "fa"
      ? siteConfig.contact.phones.faTrAz
      : siteConfig.contact.phones.arFr;

  return (
    <footer data-site-footer className="full-bleed overflow-hidden bg-[#082e24] text-white">
      <div className="page-shell py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.75fr_1fr] lg:gap-16">
          <div>
            <SiteBrand variant="full" size="lg" className="text-white" />
            <h2 className="mt-7 max-w-[18ch] font-display text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl">
              {tFooter("title")}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
              {tFooter("description")}
            </p>
            <Link
              href={localizePath(locale, "/register")}
              locale={locale}
              className="mt-7 inline-flex items-center text-sm font-semibold text-[#e2c47d] transition-colors hover:text-white"
            >
              {tCommon("nav.register")}
              <ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
            </Link>
            <Link
              href={localizePath(locale, "/support")}
              locale={locale}
              className="ms-5 mt-7 inline-flex items-center text-sm font-semibold text-white/75 transition-colors hover:text-white"
            >
              {tCommon("nav.support")}
              <ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">
              {tCommon("labels.navigate")}
            </p>
            <nav className="mt-5 grid gap-3 text-sm">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={localizePath(locale, link.href)}
                  locale={locale}
                  className="w-fit text-white/68 transition-colors hover:text-white"
                >
                  {tCommon(`nav.${link.key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">
              {tCommon("labels.connect")}
            </p>
            <div className="mt-5 space-y-4 text-sm text-white/68">
              <a
                href={`mailto:${siteConfig.contact.primaryEmail}`}
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-[#d7b56d]" />
                <span className="break-all">{siteConfig.contact.primaryEmail}</span>
              </a>
              <a
                href={`tel:${primaryPhone.tel}`}
                className="flex items-start gap-3 transition-colors hover:text-white"
              >
                <Phone className="mt-0.5 size-4 shrink-0 text-[#d7b56d]" />
                <span>{primaryPhone.display}</span>
              </a>
              {siteConfig.contact.addressLineOne && siteConfig.contact.addressLineTwo ? (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#d7b56d]" />
                  <span>
                    {siteConfig.contact.addressLineOne}, {siteConfig.contact.addressLineTwo}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
          <p>Paris · France</p>
        </div>
      </div>
    </footer>
  );
}
