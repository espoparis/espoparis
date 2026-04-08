"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SiteBrand } from "@/components/shared/site-brand";
import { AnimatedShaderBackdrop } from "@/components/ui/animated-shader-hero";
import { Badge } from "@/components/ui/badge";

type AuthSplitShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  visualEyebrow: string;
  visualTitle: string;
  visualDescription: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

function splitTitle(title: string) {
  if (title.includes(" ")) {
    const words = title.split(" ");
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }

  return [title, ""];
}

export function AuthSplitShell({
  eyebrow,
  title,
  description,
  visualEyebrow,
  visualTitle,
  visualDescription,
  children,
  footer,
}: AuthSplitShellProps) {
  const [headlineTop, headlineBottom] = splitTitle(visualTitle);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="grid min-h-screen w-full bg-background md:grid-cols-[1fr_1fr]">
      <div className="flex w-full items-center justify-center px-6 py-14 sm:px-10 md:px-9 lg:px-14 xl:px-16">
        <div className="w-full max-w-md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            <motion.div variants={itemVariants}>
              <SiteBrand variant="full" size="md" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 text-left">
              <p className="section-eyebrow">{eyebrow}</p>
              <h1 className="font-display text-[clamp(2.1rem,5vw,3.35rem)] font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {description}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>{children}</motion.div>

            {footer ? (
              <motion.div variants={itemVariants}>{footer}</motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>

      <div className="relative hidden min-h-screen overflow-hidden border-l border-border/60 md:block">
        <AnimatedShaderBackdrop />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.02)_0%,hsl(var(--background)/0.14)_100%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between px-8 py-10 lg:px-12 lg:py-14 xl:px-16">
          <div className="space-y-4">
            <Badge className="section-eyebrow bg-primary/30 !text-white">
              {visualEyebrow}
            </Badge>
            <div className="space-y-2">
              <h2 className="font-display text-[clamp(2.7rem,4.5vw,4.6rem)] font-semibold leading-[0.94] tracking-tight text-white">
                {headlineTop}
              </h2>
              {headlineBottom ? (
                <h2 className="font-display text-[clamp(2.7rem,4.5vw,4.6rem)] font-semibold leading-[0.94] tracking-tight text-white">
                  {headlineBottom}
                </h2>
              ) : null}
            </div>
            <p className="max-w-xl text-lg leading-8 text-white">
              {visualDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
