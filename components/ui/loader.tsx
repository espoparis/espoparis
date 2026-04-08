"use client";

import { motion } from "framer-motion";
import { SiteBrand } from "@/components/shared/site-brand";
import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
  label?: string;
  brandVariant?: "full" | "mark";
};

export function BrandLoader({
  className,
  label = "Loading",
  brandVariant = "full",
}: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <SiteBrand variant={brandVariant} size={brandVariant === "full" ? "lg" : "md"} />

      <div className="relative flex items-center justify-center">
        <div className="h-11 w-11 rounded-full border-2 border-border/45 border-t-primary animate-spin" />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/8 blur-md" />
      </div>

      <div className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-2 w-2 rounded-full bg-primary/85"
            animate={{
              opacity: [0.25, 1, 0.25],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.15,
              repeat: Infinity,
              delay: index * 0.14,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );
}
