import { Quote } from "lucide-react";
import type { DailyReflection } from "@/server/content/cms";

type Copy = { eyebrow: string; source: string };

export function HomeDailyReflection({ reflection, locale, copy }: { reflection: DailyReflection | null; locale: string; copy: Copy }) {
  if (!reflection) return null;
  const translation = reflection.translations?.[locale as "en" | "fr" | "ar" | "fa"];
  return <section className="full-bleed bg-[#f4efe3] dark:bg-[#0a211b]"><div className="page-shell py-12 sm:py-16"><div className="mx-auto max-w-5xl rounded-[2rem] border border-[#d8c79f] bg-white p-7 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-10"><Quote className="mx-auto size-5 text-[#a27e32]"/><p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p><blockquote dir="rtl" className="mx-auto mt-5 max-w-4xl font-display text-2xl font-medium leading-[1.9] text-[#18372e] dark:text-white sm:text-3xl">{reflection.arabicText}</blockquote>{translation && translation !== reflection.arabicText ? <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#5d6e68] dark:text-white/65">{translation}</p> : null}<p className="mt-5 text-xs font-medium text-[#77684b] dark:text-white/45">{copy.source}: {reflection.sourceLabel}{reflection.occasionLabel ? ` · ${reflection.occasionLabel}` : ""}</p></div></div></section>;
}
