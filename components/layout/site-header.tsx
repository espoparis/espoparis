import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteBrand } from "@/components/shared/site-brand";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SitePrimaryNav } from "@/components/layout/site-primary-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { localizePath } from "@/lib/constants/app";

type Props = {
  locale: string;
};

export async function SiteHeader({ locale }: Props) {
  const tNav = await getTranslations({ locale, namespace: "common.nav" });

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-50">
      <div className="page-shell py-4">
        <div className="flex min-h-[5rem] items-center justify-between gap-4 rounded-[1.65rem] border border-white/10 bg-[#082e24]/90 px-4 shadow-[0_24px_70px_-34px_rgba(0,0,0,.72)] backdrop-blur-2xl sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <SiteBrand
              href="/"
              locale={locale}
              size="md"
              className="shrink-0 text-white"
            />
            <div className="[&_nav]:border-white/10 [&_nav]:bg-white/[0.055] [&_a]:text-white/75 [&_a:hover]:bg-white/10 [&_a:hover]:text-white">
              <SitePrimaryNav locale={locale} />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-white">
            <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.055] p-1 xl:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <Button
              asChild
              size="sm"
              className="hidden h-10 rounded-full bg-[#d7b56d] px-5 font-semibold text-[#0b3429] shadow-[0_14px_30px_-18px_rgba(215,181,109,.8)] hover:bg-[#e4c579] md:inline-flex"
            >
              <Link href={localizePath(locale, "/register")} locale={locale}>
                {tNav("register")}
                <ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
              </Link>
            </Button>

            <div className="flex items-center gap-2 xl:hidden">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <SiteMobileNav locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
