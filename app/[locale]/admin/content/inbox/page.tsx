import { notFound } from "next/navigation";
import { getAuthSession } from "@/server/auth/session";
import { getContactInbox, isCmsConfigured } from "@/server/content/cms-repository";

export const dynamic = "force-dynamic";

const labels = {
  en: { title: "Contact messages", empty: "No messages yet.", offline: "The content service is not configured.", error: "The inbox is temporarily unavailable.", reply: "Reply by email" },
  fr: { title: "Messages reçus", empty: "Aucun message pour le moment.", offline: "Le service de contenu n'est pas configuré.", error: "La boîte de réception est temporairement indisponible.", reply: "Répondre par courriel" },
  ar: { title: "رسائل التواصل", empty: "لا توجد رسائل بعد.", offline: "خدمة المحتوى غير مهيأة.", error: "تعذّر عرض الرسائل مؤقتًا.", reply: "الرد بالبريد" },
  fa: { title: "پیام‌های تماس", empty: "هنوز پیامی ثبت نشده است.", offline: "سرویس محتوا پیکربندی نشده است.", error: "صندوق پیام‌ها موقتاً در دسترس نیست.", reply: "پاسخ با ایمیل" },
} as const;

export default async function ContactInboxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getAuthSession();
  if (session.identity?.role !== "admin") notFound();
  const t = labels[locale as keyof typeof labels] ?? labels.en;
  let messages: Awaited<ReturnType<typeof getContactInbox>> = [];
  let error = !isCmsConfigured() ? t.offline : "";
  if (!error) {
    try { messages = await getContactInbox(session.identity); }
    catch { error = t.error; }
  }
  return <main className="page-shell pb-24 pt-12">
    <h1 className="font-display text-4xl">{t.title}</h1>
    {error || !messages.length ? <p role="status" className="mt-8 text-muted-foreground">{error || t.empty}</p> : null}
    <div className="mt-10 divide-y divide-border border-y border-border">
      {messages.map(item => <article key={item.id} className="grid gap-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="min-w-0 text-sm leading-7 text-muted-foreground">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="break-all" dir="ltr">{item.email}</p>
          <p>{item.locale.toUpperCase()} · {item.reason}</p>
          <time dateTime={item.receivedAt}>{item.receivedAt}</time>
          <a className="mt-3 block w-fit underline underline-offset-4" href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}>{t.reply}</a>
        </div>
        <div className="min-w-0"><h2 className="font-display text-2xl">{item.subject}</h2><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">{item.message}</p></div>
      </article>)}
    </div>
  </main>;
}
