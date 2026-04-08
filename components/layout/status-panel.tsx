import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatusPanelProps {
  badge?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function StatusPanel({
  badge,
  title,
  description,
  icon,
  children,
  className,
}: StatusPanelProps) {
  return (
    <Card tone="strong" className={cn("display-shadow overflow-hidden", className)}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            {icon ? (
              <div className="surface-subtle flex size-12 shrink-0 items-center justify-center text-primary">
                {icon}
              </div>
            ) : null}
            <div className="space-y-2">
              {badge ? <Badge variant="muted" className="px-3 py-1">{badge}</Badge> : null}
              <div className="space-y-1">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {title}
                </h1>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </div>
          </div>
          {children ? <div className="flex flex-wrap items-center gap-3 pt-1">{children}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
