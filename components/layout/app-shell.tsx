import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-x-clip bg-background text-foreground",
        className,
      )}
    >
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
