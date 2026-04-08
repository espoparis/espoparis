import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex w-full ring-offset-background transition-shadow focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-border/60 bg-transparent text-foreground shadow-[inset_0_1px_0_hsl(var(--foreground)/0.02)] backdrop-blur-md dark:bg-background/24",
        secondary:
          "border border-border/60 bg-transparent text-foreground shadow-[inset_0_1px_0_hsl(var(--foreground)/0.03)] backdrop-blur-md dark:bg-background/32",
        ghost:
          "border border-border/50 bg-transparent text-foreground shadow-none",
      },
      size: {
        default: "h-11 rounded-xl px-3.5 py-2.5 text-sm",
        lg: "h-12 rounded-2xl px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface SelectProps
  extends
    React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(selectVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select, selectVariants };
