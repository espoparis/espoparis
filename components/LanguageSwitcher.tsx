"use client";

import { Check, Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languageMeta = {
  en: { key: "en", flag: "EN" },
  ar: { key: "ar", flag: "AR" },
  fr: { key: "fr", flag: "FR" },
  fa: { key: "fa", flag: "FA" },
} as const;

export function LanguageSwitcher() {
  const t = useTranslations("common.languages");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const current = languageMeta[locale as keyof typeof languageMeta] ?? languageMeta.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="nav"
          size="sm"
          className="h-9 gap-2 rounded-full border-0 bg-transparent px-3 text-foreground/85 hover:bg-background/72 hover:text-foreground"
          aria-label={t("label")}
        >
          <Globe2 className="h-4 w-4" />
          <span>{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-[1.35rem] border-border/60 bg-background/96 p-1.5">
        {routing.locales.map((item) => {
          const meta = languageMeta[item as keyof typeof languageMeta];

          return (
            <DropdownMenuItem
              key={item}
              className="flex items-center justify-between"
              onClick={() => router.replace(pathname, { locale: item })}
            >
              <span>{t(meta.key)}</span>
              {item === locale ? <Check className="h-4 w-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
