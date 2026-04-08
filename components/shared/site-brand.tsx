"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type SiteBrandProps = {
  variant?: "full" | "text" | "mark";
  size?: "sm" | "md" | "lg";
  href?: string;
  locale?: string;
  className?: string;
};

const sizeStyles = {
  sm: {
    wordmark: "h-9",
    mark: "h-10 w-10",
    text: "text-base",
  },
  md: {
    wordmark: "h-11",
    mark: "h-11 w-11",
    text: "text-lg",
  },
  lg: {
    wordmark: "h-12",
    mark: "h-12 w-12",
    text: "text-xl",
  },
} as const;

export function SiteBrand({
  variant = "full",
  size = "md",
  href,
  locale,
  className,
}: SiteBrandProps) {
  const styles = sizeStyles[size];
  const [wordmarkAvailable, setWordmarkAvailable] = React.useState(true);
  const [wordmarkDarkAvailable, setWordmarkDarkAvailable] = React.useState(true);
  const [markAvailable, setMarkAvailable] = React.useState(true);
  const [markDarkAvailable, setMarkDarkAvailable] = React.useState(true);

  const content =
    variant === "full" ? (
      wordmarkAvailable || wordmarkDarkAvailable ? (
        <>
          {wordmarkAvailable ? (
            <Image
              src={siteConfig.brand.wordmarkSrc}
              alt={siteConfig.brand.alt}
              width={360}
              height={96}
              priority={size !== "sm"}
              className={cn("w-auto object-contain dark:hidden", styles.wordmark)}
              onError={() => setWordmarkAvailable(false)}
            />
          ) : null}
          {wordmarkDarkAvailable ? (
            <Image
              src={siteConfig.brand.wordmarkDarkSrc}
              alt={siteConfig.brand.alt}
              width={360}
              height={96}
              priority={size !== "sm"}
              className={cn("hidden w-auto object-contain dark:block", styles.wordmark)}
              onError={() => setWordmarkDarkAvailable(false)}
            />
          ) : null}
        </>
      ) : (
        <span
          className={cn(
            "block truncate font-display font-semibold tracking-tight text-foreground/95",
            styles.text,
          )}
        >
          {siteConfig.name}
        </span>
      )
    ) : variant === "mark" ? (
      markAvailable || markDarkAvailable ? (
        <>
          {markAvailable ? (
            <Image
              src={siteConfig.brand.markSrc}
              alt={siteConfig.brand.alt}
              width={96}
              height={96}
              className={cn("rounded-full object-contain dark:hidden", styles.mark)}
              onError={() => setMarkAvailable(false)}
            />
          ) : null}
          {markDarkAvailable ? (
            <Image
              src={siteConfig.brand.markDarkSrc}
              alt={siteConfig.brand.alt}
              width={96}
              height={96}
              className={cn("hidden rounded-full object-contain dark:block", styles.mark)}
              onError={() => setMarkDarkAvailable(false)}
            />
          ) : null}
        </>
      ) : (
        <span
          className={cn(
            "block truncate font-display font-semibold tracking-tight text-foreground/95",
            styles.text,
          )}
        >
          {siteConfig.shortName}
        </span>
      )
    ) : (
      <span
        className={cn(
          "block truncate font-display font-semibold tracking-tight text-foreground/95",
          styles.text,
        )}
      >
        {siteConfig.name}
      </span>
    );

  const sharedClassName = cn("flex min-w-0 items-center text-foreground", className);

  if (href) {
    return (
      <Link href={href} locale={locale} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
}
