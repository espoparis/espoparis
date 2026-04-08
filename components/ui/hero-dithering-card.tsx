"use client";

import { ArrowRight } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "@/lib/navigation";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  })),
);

interface CallToAction {
  text: string;
  href: string;
  variant: "primary" | "secondary";
}

interface AnnouncementBanner {
  text: string;
  linkText: string;
  linkHref: string;
}

interface CTASectionProps {
  badge: string;
  title: string;
  description: string;
  callToActions: CallToAction[];
  announcementBanner?: AnnouncementBanner;
  className?: string;
  compact?: boolean;
}

interface HeroDitheringBackdropProps {
  className?: string;
  hovered?: boolean;
}

export function HeroDitheringBackdrop({
  className,
  hovered = false,
}: HeroDitheringBackdropProps) {
  const [shaderColor, setShaderColor] = useState("#2f90bb");

  useEffect(() => {
    const root = document.documentElement;
    const primary = getComputedStyle(root).getPropertyValue("--primary").trim();

    if (primary) {
      const parts = primary.split(/\s+/).filter(Boolean);

      if (parts.length >= 3) {
        setShaderColor(`hsl(${parts[0]}, ${parts[1]}, ${parts[2]})`);
      } else {
        setShaderColor(primary);
      }
    }
  }, []);

  return (
    <>
      <Suspense fallback={<div className="absolute inset-0 bg-muted/10" />}>
        <div
          className={`pointer-events-none absolute inset-0 z-0 opacity-16 mix-blend-multiply dark:opacity-18 dark:mix-blend-screen ${
            className ?? ""
          }`}
        >
          <Dithering
            colorBack="#00000000"
            colorFront={shaderColor}
            shape="warp"
            type="4x4"
            speed={hovered ? 0.6 : 0.2}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--background) / 0.96) 0%, hsl(var(--background) / 0.9) 26%, hsl(var(--background) / 0.76) 44%, hsl(var(--background) / 0.3) 68%, transparent 100%)",
        }}
      />
    </>
  );
}

export function CTASection({
  badge,
  title,
  description,
  callToActions,
  announcementBanner,
  className,
  compact = false,
}: CTASectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className={`w-full ${className ?? ""}`}>
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative flex w-full flex-col items-center justify-center overflow-hidden px-6 sm:px-8 lg:px-12 xl:px-16 ${
            compact ? "py-20 sm:py-20 lg:py-24" : "py-36 sm:py-24 lg:py-32"
          }`}
        >
          <HeroDitheringBackdrop hovered={isHovered} />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
            {announcementBanner ? (
              <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary/12 bg-background/96 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_12px_32px_hsl(var(--background)/0.28)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {announcementBanner.text}
                <Link
                  href={announcementBanner.linkHref}
                  className="font-semibold transition-colors hover:text-primary/80"
                >
                  {announcementBanner.linkText}{" "}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            ) : null}

            <h1 className="mb-8 max-w-5xl font-display text-[clamp(2.9rem,7vw,5.5rem)] font-medium leading-[0.96] text-foreground">
              {title}
            </h1>

            <p className="mb-12 max-w-3xl text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8 lg:text-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:gap-x-7">
              {callToActions.map((cta) =>
                cta.variant === "primary" ? (
                  <Link
                    key={cta.text}
                    href={cta.href}
                    className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-12 text-base font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20 active:scale-95"
                  >
                    <span className="relative z-10">{cta.text}</span>
                    <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <Link
                    key={cta.text}
                    href={cta.href}
                    className="text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground sm:text-base"
                  >
                    {cta.text} <span aria-hidden="true">→</span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { CTASectionProps };
