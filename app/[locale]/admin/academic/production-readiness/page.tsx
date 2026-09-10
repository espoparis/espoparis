import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAuthSession } from "@/server/auth/session";
import { buildProductionGates } from "@/server/production/readiness";

export default async function ProductionReadinessPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "productionReadiness" });
  const session = await getAuthSession();

  // Real values are deliberately not inferred before production auth/config is active.
  const gates = buildProductionGates({
    enrollmentAuditClean: false,
    enrollmentRepairVerified: false,
    appsScriptBridgeConfigured: false,
    authConfigured: false,
    staffAccessConfigured: false,
    academicSheetsConfigured: false,
    backupConfirmed: false,
    addressConfirmed: false,
    legalNameConfirmed: false,
  });

  if (!session.authenticated) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-primary/70">{t("eyebrow")}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t("lockedTitle")}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t("lockedBody")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-primary/70">{t("eyebrow")}</p>
      <h1 className="mt-3 text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">{t("body")}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {gates.map((gate) => (
          <article key={gate.id} className="rounded-2xl border border-border/70 bg-card/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-medium">{gate.label}</h2>
              <span className="rounded-full border px-3 py-1 text-xs uppercase tracking-wide">{gate.status}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{gate.detail}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
