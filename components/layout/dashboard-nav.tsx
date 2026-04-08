"use client";

import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/lib/navigation";
import type { DashboardLink } from "@/lib/types/domain";

type Props = {
  locale: string;
  links: DashboardLink[];
  className?: string;
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

export function DashboardNav({ locale, links, className }: Props) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            locale={locale}
            className={cn(
              "rounded-2xl px-4 py-3 text-sm transition",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
