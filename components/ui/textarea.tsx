import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const textareaVariants = cva(
  "flex w-full ring-offset-background transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
        default: "min-h-[120px] rounded-xl px-3.5 py-3 text-sm",
        lg: "min-h-32 rounded-2xl px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
