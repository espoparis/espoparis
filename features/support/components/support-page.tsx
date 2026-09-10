import { HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  contactTitle: string;
  contactDescription: string;
  whatsappAction: string;
  emailAction: string;
  stewardshipTitle: string;
  stewardshipDescription: string;
  note: string;
  whatsappMessage: string;
};

export function SupportPage({ copy }: { copy: Copy }) {
  const phone = siteConfig.contact.donationsPhone;
  const whatsappHref = `https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(copy.whatsappMessage)}`;

  return (
    <main className="full-bleed bg-[#fbf8f0] text-[#102c24] dark:bg-[#071a15] dark:text-[#f6f1e4]">
      <section className="page-shell py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98772f]">{copy.eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">{copy.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#50645d] dark:text-white/68 sm:text-lg">{copy.description}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#d9ccb0] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0f4738] text-[#e9cd8a]"><HeartHandshake className="size-6" /></div>
            <h2 className="mt-6 font-display text-2xl font-medium">{copy.contactTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6e68] dark:text-white/62">{copy.contactDescription}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#0f4738] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#133f34]">
                <MessageCircle className="me-2 size-4" />{copy.whatsappAction}
              </a>
              <a href={`mailto:${siteConfig.contact.donationsEmail}`} className="inline-flex items-center justify-center rounded-full border border-[#cbb987] px-5 py-3 text-sm font-semibold transition hover:bg-[#f5eedc] dark:hover:bg-white/5">
                {copy.emailAction}
              </a>
            </div>
            <p className="mt-5 text-sm font-semibold text-[#8a6d2f]">{phone.display}</p>
          </div>

          <div className="rounded-[2rem] border border-[#d9ccb0] bg-[#0b3329] p-7 text-white shadow-sm dark:border-white/10 sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#e9cd8a]"><ShieldCheck className="size-6" /></div>
            <h2 className="mt-6 font-display text-2xl font-medium">{copy.stewardshipTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">{copy.stewardshipDescription}</p>
            <p className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/58">{copy.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
