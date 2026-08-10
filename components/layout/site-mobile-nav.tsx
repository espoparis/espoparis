"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { SiteBrand } from "@/components/shared/site-brand";
import { isActivePath, publicNavLinks } from "@/lib/constants/app";
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
};

export function SiteMobileNav({ locale }: Props) {
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

          <div className="flex flex-col gap-2 rounded-[1.5rem] border border-border/60 bg-secondary/35 p-4">
            <p className="section-eyebrow">{tCommon("labels.navigate")}</p>
            <p className="text-sm text-muted-foreground">{tMobile("description")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
