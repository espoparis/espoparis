"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { isActivePath, publicNavLinks } from "@/lib/constants/app";
import { Link, usePathname } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  locale: string;
};

export function SitePrimaryNav({ locale }: Props) {
  const t = useTranslations("common.nav");
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-secondary/45 p-1 shadow-[inset_0_1px_0_hsl(var(--background)/0.85)] md:flex">
      {publicNavLinks.map((link) => {
        const active = isActivePath(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            locale={locale}
            className={cn(
              buttonVariants({ variant: active ? "soft" : "nav", size: "sm" }),
              active
                ? "bg-background text-foreground shadow-[0_10px_24px_-18px_hsl(var(--foreground)/0.35)] ring-1 ring-border/70"
                : "hover:bg-background/72 hover:text-foreground"
            )}
          >
            {t(link.key)}
          </Link>
        );
      })}
    </nav>
  );
}
