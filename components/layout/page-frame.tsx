import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageFrameProps {
  children: ReactNode;
  className?: string;
}

export function PageFrame({ children, className }: PageFrameProps) {
  return <div className={cn("page-shell", className)}>{children}</div>;
}
