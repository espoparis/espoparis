"use client";
import { useTranslations } from "next-intl";
import { isActivePath, publicNavLinks } from "@/lib/constants/app";
import { Link, usePathname } from "@/lib/navigation";

type Props = { locale: string };
export function SitePrimaryNav({ locale }: Props) {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-5 2xl:flex">
      {publicNavLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return <Link key={link.href} href={link.href} locale={locale} aria-current={active ? "page" : undefined} className={`border-b py-3 text-sm transition-colors ${active ? "border-[#d7b56d] text-white" : "border-transparent text-white/75 hover:border-white/40 hover:text-white"}`}>{t(link.key)}</Link>;
      })}
    </nav>
  );
}
