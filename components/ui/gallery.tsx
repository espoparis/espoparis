"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type GalleryImage = {
  src: string;
  alt: string;
};

type PhotoGalleryProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  locale: string;
  images: GalleryImage[];
  animationDelay?: number;
};

type Direction = "left" | "right";

type PositionedImage = GalleryImage & {
  id: number;
  order: number;
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
};

const desktopOffsets = [
  { x: "-360px", y: "18px", zIndex: 50, direction: "left" as const },
  { x: "-180px", y: "42px", zIndex: 40, direction: "left" as const },
  { x: "0px", y: "0px", zIndex: 30, direction: "right" as const },
  { x: "180px", y: "28px", zIndex: 20, direction: "right" as const },
  { x: "360px", y: "52px", zIndex: 10, direction: "left" as const },
];

export function PhotoGallery({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  locale,
  images,
  animationDelay = 0.35,
}: PhotoGalleryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const visibilityTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 1000);

    const animationTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, (animationDelay + 0.35) * 1000);

    return () => {
      window.clearTimeout(visibilityTimer);
      window.clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const positionedImages: PositionedImage[] = images.slice(0, 5).map((image, index) => ({
    ...image,
    id: index + 1,
    order: index,
    ...desktopOffsets[index],
  }));

  return (
    <section className="py-8 md:py-10">
      <div className="space-y-10 md:space-y-14">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display">
            {title}
          </h2>
          <p className="public-copy-lead mx-auto max-w-2xl">
            {description}
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-20 hidden h-[22rem] bg-[linear-gradient(to_right,hsl(var(--border)/0.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.45)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-45 [mask-image:radial-gradient(ellipse_78%_52%_at_50%_32%,#000_68%,transparent_100%)] md:block"
          />

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {positionedImages.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 shadow-[0_28px_80px_-48px_hsl(var(--foreground)/0.26)]",
                  index === 2 ? "sm:col-span-2 aspect-[1.28/1]" : "aspect-[0.92/1]",
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="relative hidden h-[25rem] items-start justify-center md:flex lg:h-[28rem]">
            <motion.div
              className="relative flex w-full max-w-[78rem] justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="relative h-[18rem] w-[16rem] lg:h-[21rem] lg:w-[18rem]">
                {[...positionedImages].reverse().map((image) => (
                  <GalleryPhoto
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                    width={288}
                    height={368}
                    direction={image.direction}
                    style={{ zIndex: image.zIndex }}
                    className="absolute left-0 top-0"
                    initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
                    animate={
                      isLoaded
                        ? {
                            x: image.x,
                            y: image.y,
                            rotate: 0,
                            scale: 1,
                          }
                        : undefined
                    }
                    transition={{
                      type: "spring",
                      stiffness: 72,
                      damping: 13,
                      mass: 1,
                      delay: image.order * 0.12,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button asChild variant="hero" size="lg">
            <Link href={ctaHref} locale={locale}>
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function getRandomNumberInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type GalleryPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  style?: CSSProperties;
  initial?: Record<string, string | number>;
  animate?: Record<string, string | number>;
  transition?: Record<string, string | number>;
};

function GalleryPhoto({
  src,
  alt,
  className,
  direction = "right",
  width,
  height,
  style,
  initial,
  animate,
  transition,
}: GalleryPhotoProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const value = getRandomNumberInRange(1.2, 3.2) * (direction === "left" ? -1 : 1);
    setRotation(value);
  }, [direction]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileHover={{
        scale: 1.04,
        rotateZ: rotation * 0.55,
        zIndex: 999,
      }}
      whileTap={{ scale: 1.06, zIndex: 999 }}
      whileDrag={{ scale: 1.02, zIndex: 999 }}
      initial={initial}
      animate={animate ? { ...animate, rotate: rotation } : { rotate: rotation }}
      transition={transition}
      style={{
        width,
        height,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
        ...style,
      }}
      className={cn("relative cursor-grab active:cursor-grabbing", className)}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-[0_34px_80px_-50px_hsl(var(--foreground)/0.4)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 30vw, 18rem"
          className="object-cover"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
