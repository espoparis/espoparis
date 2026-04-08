import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionBlockProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function SectionBlock({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
  contentClassName,
}: SectionBlockProps) {
  return (
    <section className={cn("section-space stack-section", className)}>
      {eyebrow || title || description || actions ? (
        <div
          className={cn(
            "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
            headerClassName,
          )}
        >
          <div className="content-measure space-y-3">
            {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}

      <div className={cn("panel-grid", contentClassName)}>{children}</div>
    </section>
  );
}
