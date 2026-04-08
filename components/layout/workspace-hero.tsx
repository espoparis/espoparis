import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WorkspaceHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  badges?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function WorkspaceHero({
  eyebrow,
  title,
  description,
  badges,
  actions,
  children,
  className,
}: WorkspaceHeroProps) {
  return (
    <section
      className={cn(
        "surface-panel-strong section-space px-6 py-7 sm:px-8",
        className,
      )}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="content-measure space-y-4">
            {badges ? (
              <div className="flex flex-wrap items-center gap-2">{badges}</div>
            ) : null}
            {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
          ) : null}
        </div>
        {children ? <div className="grid gap-4">{children}</div> : null}
      </div>
    </section>
  );
}
