import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Clock3, MailCheck } from "lucide-react";
import { Button } from "./button";
import { StatusPanel } from "@/components/layout/status-panel";

interface PendingStateProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  footer?: ReactNode;
}

export function PendingState({
  title,
  description,
  primaryAction,
  secondaryAction,
  footer,
}: PendingStateProps) {
  const t = useTranslations("status.pending");

  return (
    <StatusPanel
      badge={t("badge")}
      title={title}
      description={description}
      icon={<Clock3 className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {primaryAction ? (
          <Button onClick={primaryAction.onClick} className="gap-2">
            <MailCheck className="h-4 w-4" />
            {primaryAction.label}
          </Button>
        ) : null}
        {secondaryAction ? (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        ) : null}
      </div>
      {footer ? <div className="pt-4 text-sm text-muted-foreground">{footer}</div> : null}
    </StatusPanel>
  );
}
