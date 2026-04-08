import { LayoutDashboard } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getSessionContext } from "@/server/auth/session";
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
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const { profile } = await getSessionContext();

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
            <SiteMobileNav locale={locale} profile={profile} />
            {profile ? (
              <Button asChild variant="hero" className="hidden md:inline-flex">
                <Link href="/dashboard" locale={locale}>
                  <LayoutDashboard className="h-4 w-4" />
                  {tCommon("actions.openWorkspace")}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="nav" asChild className="hidden md:inline-flex">
                  <Link href="/auth/login" locale={locale}>
                    {tCommon("actions.signIn")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="hero"
                  className="hidden md:inline-flex"
                >
                  <Link href="/auth/register" locale={locale}>
                    {tCommon("actions.applyForAccess")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
