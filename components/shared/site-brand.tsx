"use client";

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
  sm: { mark: "size-9", latin: "text-[0.66rem]", arabic: "text-[0.7rem]" },
  md: { mark: "size-11", latin: "text-[0.72rem]", arabic: "text-[0.78rem]" },
  lg: { mark: "size-14", latin: "text-[0.8rem]", arabic: "text-[0.86rem]" },
} as const;

export function SiteBrand({
  variant = "full",
  size = "md",
  href,
  locale,
  className,
}: SiteBrandProps) {
  const styles = sizeStyles[size];

  const mark = (
    <span className={cn("relative shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5", styles.mark)}>
      <Image
        src="/brand-mark.webp"
        alt=""
        fill
        sizes="64px"
        className="object-contain p-1"
        priority={size !== "sm"}
      />
    </span>
  );

  const content =
    variant === "mark" ? (
      mark
    ) : variant === "text" ? (
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-display font-semibold tracking-[-0.02em] text-current">
          {siteConfig.seminaryName}
        </span>
      </span>
    ) : (
      <>
        {mark}
        <span className="hidden min-w-0 leading-none sm:block">
          <span className={cn("block whitespace-nowrap font-semibold uppercase tracking-[0.12em] text-current/75", styles.latin)}>
            École Supérieure de Paris
          </span>
          <span className={cn("mt-1.5 block whitespace-nowrap font-semibold tracking-tight text-current", styles.arabic)} dir="rtl">
            مركز الإمام (عج) – باريس
          </span>
        </span>
      </>
    );

  const sharedClassName = cn("flex min-w-0 items-center gap-2.5 text-current", className);

  if (href) {
    return (
      <Link href={href} locale={locale} className={sharedClassName} aria-label={siteConfig.seminaryName}>
        {content}
      </Link>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
}
