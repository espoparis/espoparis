import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export async function AuthShell({ eyebrow, title, description, children }: Props) {
  const t = await getTranslations("shell.auth");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <section className="surface-panel-strong flex flex-col justify-between gap-8 px-6 py-7 sm:px-8 lg:pt-8">
        <div className="space-y-5">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1 className="max-w-xl font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            {t("heroDescription")}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="surface-subtle p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Secure entry</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sign in, recover access, and return to your account with less friction.
            </p>
          </div>
          <div className="surface-subtle p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Clear next step</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Approval and access states stay visible so every next step feels clear.
            </p>
          </div>
        </div>
      </section>

      <Card tone="strong" className="display-shadow overflow-hidden">
        <CardHeader className="space-y-3 pb-4">
          <p className="section-eyebrow">{title}</p>
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="text-sm leading-6">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}
