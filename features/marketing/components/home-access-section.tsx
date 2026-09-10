import { ArrowUpRight, BookOpenText, GraduationCap, LibraryBig } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Link } from "@/lib/navigation";
import { localizePath } from "@/lib/constants/app";

type AccessItem = {
  title: string;
  description: string;
  action: string;
};

type Props = {
  locale: string;
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    academic: AccessItem;
    library: AccessItem;
    learning: AccessItem;
  };
};

const items = [
  { key: "academic" as const, href: "/academic-program", Icon: GraduationCap },
  { key: "library" as const, href: "/library", Icon: LibraryBig },
  { key: "learning" as const, href: "/learning", Icon: BookOpenText },
];

export function HomeAccessSection({ locale, copy }: Props) {
  return (
    <section className="page-shell py-16 sm:py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
        <Reveal>
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-4 public-heading-display max-w-[13ch]">{copy.title}</h2>
          <p className="mt-5 public-copy-lead max-w-xl">{copy.description}</p>
        </Reveal>

        <Stagger className="grid gap-4 md:grid-cols-3">
          {items.map(({ key, href, Icon }, index) => {
            const item = copy[key];
            return (
              <StaggerItem key={key}>
                <Link
                  href={localizePath(locale, href)}
                  locale={locale}
                  className="group flex h-full min-h-[19rem] flex-col rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_26px_80px_-58px_hsl(var(--foreground)/0.35)] transition duration-300 hover:-translate-y-1 hover:border-primary/25 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/[0.07] text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-display text-3xl font-medium text-primary/20">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground sm:text-base">{item.description}</p>
                  <span className="mt-7 inline-flex items-center text-sm font-semibold text-primary">
                    {item.action}
                    <ArrowUpRight className="ms-2 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-rotate-90 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
