"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { StatusPanel } from "@/components/layout/status-panel";
import { Button } from "@/components/ui/button";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  icon?: ReactNode;
};

type Props = {
  title?: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  footer?: ReactNode;
};

export function AppErrorState({
  title,
  description,
  primaryAction,
  secondaryAction,
  footer,
}: Props) {
  const t = useTranslations("status.error");

  return (
    <StatusPanel
      badge={t("badge")}
      title={title ?? t("defaultTitle")}
      description={description ?? t("defaultDescription")}
      icon={<AlertTriangle className="h-5 w-5" />}
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {primaryAction ? (
          <Button onClick={primaryAction.onClick} className="gap-2 rounded-full">
            {primaryAction.icon ?? <RefreshCw className="h-4 w-4" />}
            {primaryAction.label}
          </Button>
        ) : null}
        {secondaryAction ? (
          <Button
            variant={secondaryAction.variant ?? "outline"}
            onClick={secondaryAction.onClick}
            className="gap-2 rounded-full"
          >
            {secondaryAction.icon}
            {secondaryAction.label}
          </Button>
        ) : null}
      </div>
      {footer ? <div className="pt-4 text-sm text-muted-foreground">{footer}</div> : null}
    </StatusPanel>
  );
}
