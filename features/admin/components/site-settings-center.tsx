import { CheckCircle2, Clock3, Globe2, Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import type { PublicSiteSettings } from "@/server/admin/site-settings";

export type SettingsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  verified: string;
  pending: string;
  contactTitle: string;
  contactDescription: string;
  fields: Record<keyof PublicSiteSettings, string>;
  pendingTitle: string;
  pendingDescription: string;
  publishRuleTitle: string;
  publishRuleDescription: string;
  persistenceTitle: string;
  persistenceDescription: string;
};

function SettingRow({ label, value, pending, verifiedLabel, pendingLabel }: { label: string; value: string | null; pending?: boolean; verifiedLabel: string; pendingLabel: string }) {
  return <div className="flex flex-col gap-2 rounded-2xl border border-[#e5d9bd] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.03]"><div><p className="text-xs uppercase tracking-[0.12em] text-[#8b7c5a] dark:text-white/40">{label}</p><p className="mt-1 text-sm font-semibold">{value ?? "—"}</p></div><span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${pending ? "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200" : "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"}`}>{pending ? <Clock3 className="size-3"/> : <CheckCircle2 className="size-3"/>}{pending ? pendingLabel : verifiedLabel}</span></div>;
}

export function SiteSettingsCenter({ copy, settings, pendingFields }: { copy: SettingsCopy; settings: PublicSiteSettings; pendingFields: Array<keyof PublicSiteSettings> }) {
  const isPending = (field: keyof PublicSiteSettings) => pendingFields.includes(field);
  return <main className="full-bleed min-h-screen bg-[#f8f5ed] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]"><section className="page-shell py-12 sm:py-16 lg:py-20"><div className="max-w-4xl"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p><h1 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{copy.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[#5d6e68] dark:text-white/64">{copy.description}</p></div>
  <div className="mt-10 grid gap-5 lg:grid-cols-3"><article className="lg:col-span-2 rounded-[1.75rem] border border-[#dccca9] bg-[#efe7d4] p-6 dark:border-white/10 dark:bg-white/[0.05]"><Globe2 className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.contactTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.contactDescription}</p></article><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><ShieldAlert className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.pendingTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.pendingDescription}</p></article></div>
  <div className="mt-8 grid gap-4 lg:grid-cols-2"><SettingRow label={copy.fields.contactEmail} value={settings.contactEmail} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.phoneArabicFrench} value={settings.phoneArabicFrench} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.phonePersianTurkishAzerbaijani} value={settings.phonePersianTurkishAzerbaijani} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.phoneEnglish} value={settings.phoneEnglish} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.phoneAfrica} value={settings.phoneAfrica} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.supportPhone} value={settings.supportPhone} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.publicAddress} value={settings.publicAddress} pending={isPending("publicAddress")} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.visitingHours} value={settings.visitingHours} pending={isPending("visitingHours")} verifiedLabel={copy.verified} pendingLabel={copy.pending}/><SettingRow label={copy.fields.legalPublicName} value={settings.legalPublicName} pending={isPending("legalPublicName")} verifiedLabel={copy.verified} pendingLabel={copy.pending}/></div>
  <div className="mt-8 grid gap-5 lg:grid-cols-2"><article className="rounded-[1.75rem] border border-[#c8b785] bg-[#eee5cf] p-6 dark:border-[#d5b769]/20 dark:bg-[#d5b769]/[0.08]"><MapPin className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.publishRuleTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.publishRuleDescription}</p></article><article className="rounded-[1.75rem] border border-[#dccca9] bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"><Mail className="size-5 text-[#98772f]"/><h2 className="mt-4 font-display text-xl">{copy.persistenceTitle}</h2><p className="mt-2 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.persistenceDescription}</p></article></div>
  </section></main>;
}
