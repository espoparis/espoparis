"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const t = useTranslations("common.actions");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="nav"
      size="icon"
      type="button"
      disabled={!mounted}
      className="header-control relative h-10 w-10 rounded-sm border-0 bg-transparent text-foreground hover:bg-muted"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("toggleTheme")}
      aria-pressed={isDark}
    >
      {!mounted ? (
        <span aria-hidden="true" className="h-4 w-4" />
      ) : isDark ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
