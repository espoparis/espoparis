import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/navigation";

type QuickActionItem = {
  href: string;
  label: string;
  description: string;
};

type Props = {
  locale: string;
  items: QuickActionItem[];
  title?: string;
};

export async function QuickActionsPanel({
  locale,
  items,
  title,
}: Props) {
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return (
    <Card tone="strong">
      <CardHeader>
        <CardTitle>{title ?? t("quickActionsTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            locale={locale}
            className="group block h-full"
          >
            <Card
              tone="subtle"
              className="h-full transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:border-border/80 group-hover:bg-background/88"
            >
              <CardContent className="flex h-full flex-col gap-2 p-5">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
