import type { ReactNode } from "react";
import { Card, CardContent, type CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricPanelProps = {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  tone?: CardProps["tone"];
  className?: string;
};

export function MetricPanel({
  label,
  value,
  description,
  icon,
  tone = "soft",
  className,
}: MetricPanelProps) {
  return (
    <Card tone={tone} className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon ? <span className="text-primary">{icon}</span> : null}
          <p className="text-xs uppercase tracking-[0.3em]">{label}</p>
        </div>
        <div className="space-y-2">
          <p className="font-display text-4xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
