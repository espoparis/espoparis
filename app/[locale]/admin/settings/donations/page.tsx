import { notFound } from "next/navigation";
import { getAuthSession } from "@/server/auth/session";
import { getCmsAdminSnapshot } from "@/server/content/cms-repository";
import { saveDonationSettingsAction } from "./actions";

const labels = {
  en: { title: "Donation settings", note: "Online donations stay hidden until a verified PayPal hosted donation link is entered and enabled. The association must verify its PayPal account and donation wording before activation.", url: "PayPal hosted donation URL", enabled: "Enable online donations", save: "Save settings", offline: "Content service unavailable; settings cannot be saved." },
  fr: { title: "Paramètres des dons", note: "Les dons en ligne restent masqués jusqu'à la saisie et l'activation d'un lien de don PayPal vérifié. L'association doit valider son compte et la présentation des dons avant activation.", url: "Lien de don PayPal", enabled: "Activer les dons en ligne", save: "Enregistrer", offline: "Service de contenu indisponible ; enregistrement impossible." },
  ar: { title: "إعدادات التبرعات", note: "يبقى الدفع الإلكتروني مخفيًا إلى حين إدخال رابط تبرع مستضاف من PayPal والتحقق منه وتفعيله. على الجمعية اعتماد حسابها وصياغة التبرع قبل التفعيل.", url: "رابط التبرع المستضاف من PayPal", enabled: "تفعيل التبرعات الإلكترونية", save: "حفظ الإعدادات", offline: "خدمة المحتوى غير متاحة؛ لا يمكن حفظ الإعدادات." },
  fa: { title: "تنظیمات کمک مالی", note: "کمک مالی آنلاین تا ثبت و فعال‌سازی پیوند تأییدشدهٔ PayPal پنهان می‌ماند. انجمن باید حساب و متن کمک مالی را پیش از فعال‌سازی تأیید کند.", url: "پیوند کمک مالی PayPal", enabled: "فعال‌سازی کمک مالی آنلاین", save: "ذخیرهٔ تنظیمات", offline: "سرویس محتوا در دسترس نیست؛ امکان ذخیره وجود ندارد." },
} as const;

export default async function DonationSettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getAuthSession();
  if (session.identity?.role !== "admin") notFound();
  const t = labels[locale as keyof typeof labels] ?? labels.en;
  const snapshot = await getCmsAdminSnapshot(session.identity);
  const ready = snapshot.state === "connected";
  return <main className="page-shell max-w-3xl pb-24 pt-12">
    <h1 className="font-display text-4xl">{t.title}</h1><p className="mt-5 text-sm leading-7 text-muted-foreground">{t.note}</p>
    {!ready ? <p role="status" className="mt-6 border-s-2 border-destructive p-4">{t.offline}</p> : null}
    <form action={saveDonationSettingsAction} className="mt-10 space-y-6 border-t border-border pt-8">
      <label className="block text-sm">{t.url}<input name="paypalUrl" type="url" dir="ltr" defaultValue={snapshot.donation?.paypalUrl ?? ""} disabled={!ready} placeholder="https://www.paypal.com/donate/?hosted_button_id=…" className="mt-2 w-full rounded-sm border border-border bg-background p-3" /></label>
      <label className="flex items-center gap-3 text-sm"><input name="enabled" type="checkbox" defaultChecked={snapshot.donation?.enabled ?? false} disabled={!ready}/>{t.enabled}</label>
      <button disabled={!ready} className="bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-40">{t.save}</button>
    </form>
  </main>;
}
