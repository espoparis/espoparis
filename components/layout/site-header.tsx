import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteBrand } from "@/components/shared/site-brand";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SitePrimaryNav } from "@/components/layout/site-primary-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

type Props = {
  locale: string;
};

export async function SiteHeader({ locale }: Props) {
  const tNav = await getTranslations({ locale, namespace: "common.nav" });

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#082e24]">
      <div className="page-shell py-2">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <SiteBrand
              href="/"
              locale={locale}
              size="md"
              className="shrink-0 text-white"
            />
            <div className="min-w-0">
              <SitePrimaryNav locale={locale} />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-white">
            <div className="hidden items-center gap-1 rounded-sm border border-white/10 bg-white/[0.055] p-1 xl:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            <Button
              asChild
              size="sm"
              className="hidden h-10 rounded-sm bg-[#faf7ef] px-5 font-semibold text-[#0b3429]  hover:bg-white md:inline-flex"
            >
              <Link href={"/register"} locale={locale}>
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
