import {
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles];

export function HomeFeaturesGrid() {
  const t = useTranslations("home.featuresSection");

  const items = [
    {
      title: t("items.speed.title"),
      description: t("items.speed.description"),
    },
    {
      title: t("items.power.title"),
      description: t("items.power.description"),
    },
    {
      title: t("items.security.title"),
      description: t("items.security.description"),
    },
    {
      title: t("items.customization.title"),
      description: t("items.customization.description"),
    },
    {
      title: t("items.control.title"),
      description: t("items.control.description"),
    },
    {
      title: t("items.aiReady.title"),
      description: t("items.aiReady.description"),
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-6xl. w-full space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium text-foreground lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="relative mx-auto grid divide-x divide-y divide-border/70 *:p-12 sm:grid-cols-2 md:max-w-4xl md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <div key={item.title}>
                <div className="flex items-center gap-2 p-6">
                  <Icon className="size-4 text-foreground" />
                  <h3 className="text-sm font-medium text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
