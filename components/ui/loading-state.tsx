import { BrandLoader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
}

export function LoadingState({ className }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center py-6", className)}>
      <BrandLoader brandVariant="mark" className="gap-4" />
    </div>
  );
}
