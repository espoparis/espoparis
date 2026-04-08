import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "soft" | "strong" | "subtle" | "accent";
};

export function StatCard({ label, value, hint, icon, tone = "soft" }: Props) {
  return (
    <Card tone={tone} className="h-full">
      <CardContent className="flex h-full items-start justify-between gap-5 p-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-display text-4xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/72 text-primary">
            {icon}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
