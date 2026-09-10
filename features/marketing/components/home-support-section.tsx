import { ArrowUpRight, HeartHandshake } from "lucide-react";
import { Link } from "@/lib/navigation";
import { localizePath } from "@/lib/constants/app";

type Copy = { eyebrow: string; title: string; description: string; action: string };

export function HomeSupportSection({ locale, copy }: { locale: string; copy: Copy }) {
  return (
    <section className="full-bleed bg-[#0b3329] text-white">
      <div className="page-shell py-14 sm:py-16 lg:py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[#e3c77e]"><HeartHandshake className="size-5" /><span className="text-xs font-semibold uppercase tracking-[0.22em]">{copy.eyebrow}</span></div>
            <h2 className="mt-5 font-display text-3xl font-medium tracking-tight sm:text-4xl">{copy.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">{copy.description}</p>
          </div>
          <Link href={localizePath(locale, "/support")} locale={locale} className="mt-7 inline-flex shrink-0 items-center rounded-full bg-[#e0c27a] px-6 py-3 text-sm font-semibold text-[#15362b] transition hover:bg-[#ecd395] lg:mt-0">
            {copy.action}<ArrowUpRight className="ms-2 size-4 rtl:-rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
}
