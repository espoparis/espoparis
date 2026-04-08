import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  repeat?: number;
};

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  reverse = false,
  vertical = false,
  repeat = 2,
  ...props
}: MarqueeProps) {
  const trackClassName = cn(
    "flex shrink-0 justify-around gap-[var(--gap,1.5rem)]",
    vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
    reverse && "[animation-direction:reverse]",
    pauseOnHover && "group-hover:[animation-play-state:paused]",
  );

  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:36s] [--gap:1.5rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div key={index} className={trackClassName} aria-hidden={index > 0}>
          {children}
        </div>
      ))}
    </div>
  );
}
