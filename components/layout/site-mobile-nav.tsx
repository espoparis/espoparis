"use client";

import { LayoutDashboard, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { SiteBrand } from "@/components/shared/site-brand";
import type { SessionProfile } from "@/lib/types/domain";
import { publicNavLinks } from "@/lib/constants/app";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/lib/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  locale: string;
  profile: SessionProfile | null;
};

function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === "/") {
    return pathname === href;
  }

  return pathname.startsWith(`${href}/`);
}

export function SiteMobileNav({ locale, profile }: Props) {
  const tCommon = useTranslations("common");
  const tMobile = useTranslations("shell.mobile");
  const pathname = usePathname();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="nav"
          size="icon"
          className="size-10 rounded-full border border-border/60 bg-secondary/45 shadow-[inset_0_1px_0_hsl(var(--background)/0.85)] md:hidden"
          aria-label={tMobile("title")}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="surface-panel-strong max-w-sm overflow-hidden border-0 p-0">
        <DialogHeader className="border-b border-border/60 px-6 py-5 text-left">
          <SiteBrand variant="full" size="sm" />
          <DialogTitle className="pt-1 text-xl">{tMobile("title")}</DialogTitle>
          <DialogDescription className="max-w-xs text-sm leading-6">
            {tMobile("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6 py-6">
          <nav className="flex flex-col gap-1 rounded-[1.5rem] border border-border/60 bg-secondary/35 p-2">
            {publicNavLinks.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <DialogClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    locale={locale}
                    className={cn(
                      buttonVariants({ variant: active ? "soft" : "nav", size: "default" }),
                      "h-11 justify-start rounded-[1rem] px-4",
                      active
                        ? "bg-background text-foreground shadow-[0_10px_24px_-18px_hsl(var(--foreground)/0.35)] ring-1 ring-border/70"
                        : ""
                    )}
                  >
                    {tCommon(`nav.${link.key}`)}
                  </Link>
                </DialogClose>
              );
            })}
          </nav>

          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-border/60 bg-secondary/35 p-4">
            <div className="flex flex-col gap-1">
              <p className="section-eyebrow">{tCommon("labels.access")}</p>
              <p className="text-sm text-muted-foreground">{tMobile("description")}</p>
            </div>
            {profile ? (
              <DialogClose asChild>
                <Button asChild className="w-full">
                  <Link href="/dashboard" locale={locale}>
                    <LayoutDashboard className="h-4 w-4" />
                    {tCommon("actions.openWorkspace")}
                  </Link>
                </Button>
              </DialogClose>
            ) : (
              <div className="flex flex-col gap-3">
                <DialogClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login" locale={locale}>
                      {tCommon("actions.signIn")}
                    </Link>
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button asChild variant="hero" className="w-full">
                    <Link href="/auth/register" locale={locale}>
                      {tCommon("actions.applyForAccess")}
                    </Link>
                  </Button>
                </DialogClose>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
