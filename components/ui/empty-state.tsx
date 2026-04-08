import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { StatusPanel } from "@/components/layout/status-panel";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  action?: {
    label: string;
    href: string;
    locale?: string;
    variant?: ComponentProps<typeof Button>["variant"];
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  badge,
  action,
}: EmptyStateProps) {
  return (
    <StatusPanel
      badge={badge}
      title={title}
      description={description}
      icon={<Icon className="h-5 w-5" />}
      className="max-w-2xl"
    >
      {action ? (
        <Button asChild variant={action.variant ?? "default"} size="lg" className="px-6">
          <Link href={action.href} locale={action.locale}>
            {action.label}
          </Link>
        </Button>
      ) : null}
    </StatusPanel>
  );
}
