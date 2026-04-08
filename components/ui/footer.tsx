import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

type SocialLink = {
  icon: ReactNode;
  href: string;
  label: string;
};

type FooterProps = {
  brand?: ReactNode;
  logo?: ReactNode;
  brandName?: string;
  description?: string;
  socialLinks?: SocialLink[];
  mainLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  mainLinksTitle?: string;
  legalLinksTitle?: string;
  copyright?: {
    text: string;
    license?: string;
  };
  className?: string;
};

export function Footer({
  brand,
  logo,
  brandName,
  description,
  socialLinks = [],
  mainLinks = [],
  legalLinks = [],
  mainLinksTitle,
  legalLinksTitle,
  copyright,
  className,
}: FooterProps) {
  return (
    <footer className={cn("w-full border-t border-border/70 bg-background", className)}>
      <div className="w-full px-6 py-12 md:px-10 md:py-16 lg:px-14 xl:px-16">
        <div className="flex flex-col gap-10">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:gap-12">
            <div className="space-y-5">
              {brand ? (
                brand
              ) : logo && brandName ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-primary">
                    {logo}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-foreground">{brandName}</p>
                  </div>
                </div>
              ) : null}

              {description ? (
                <p className="max-w-md text-base leading-7 text-muted-foreground">
                  {description}
                </p>
              ) : null}

              {socialLinks.length ? (
                <div className="flex items-center gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              {mainLinksTitle ? (
                <p className="text-base font-medium text-foreground">{mainLinksTitle}</p>
              ) : null}
              <div className="space-y-2.5 text-base">
                {mainLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="block text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {legalLinksTitle ? (
                <p className="text-base font-medium text-foreground">{legalLinksTitle}</p>
              ) : null}
              <div className="space-y-2.5 text-base">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="block text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {copyright ? (
            <div className="flex flex-col gap-2 border-t border-border/70 pt-5 text-base text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>{copyright.text}</p>
              {copyright.license ? <p>{copyright.license}</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
