import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteBrand } from "@/components/shared/site-brand";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SitePrimaryNav } from "@/components/layout/site-primary-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type Props = {
  locale: string;
};

export async function SiteHeader({ locale }: Props) {
  await getTranslations({ locale, namespace: "common" });

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-50">
      <div className="page-shell py-4">
        <div className="flex min-h-[5rem] items-center justify-between gap-4 rounded-full border border-border/60 bg-background/80 px-4 shadow-[0_20px_48px_-34px_hsl(var(--foreground)/0.24)] backdrop-blur-xl sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <SiteBrand href="/" locale={locale} size="md" className="shrink-0" />

            <SitePrimaryNav locale={locale} />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-secondary/45 p-1 shadow-[inset_0_1px_0_hsl(var(--background)/0.85)] md:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2 md:hidden">
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
