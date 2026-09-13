"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";
import {
  initialContactState,
  submitContactInquiryAction,
} from "@/features/marketing/actions";
import { CONTACT_HONEYPOT_FIELD } from "@/lib/validation/contact";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  noteTitle: string;
  noteDescription: string;
  fields: {
    name: string;
    email: string;
    subject: string;
    message: string;
    reason: string;
    reasonOptions: {
      general: string;
      partnerships: string;
      visit: string;
    };
    namePlaceholder: string;
    emailPlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    pending: string;
    honeypot: string;
  };
};

export function ContactFormSection({
  locale,
  eyebrow,
  title,
  description,
  noteTitle,
  noteDescription,
  fields,
}: Props) {
  const t = useTranslations("contact.form");
  const [state, formAction] = useFormState(
    submitContactInquiryAction,
    initialContactState,
  );

  // The action returns a message key. Field-level failures resolve under
  // `errors`, everything else under `status`; fall back if a key ever drifts.
  const resolveMessage = (key: string) => {
    if (t.has(`errors.${key}`)) {
      return t(`errors.${key}`);
    }

    if (t.has(`status.${key}`)) {
      return t(`status.${key}`);
    }

    return t("status.unknown");
  };

  const message = state.messageKey ? resolveMessage(state.messageKey) : null;

  return (
    <section className="py-6 md:py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-16">
        <div className="public-intro-stack">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="public-heading-display max-w-xl">{title}</h2>
          <p className="public-copy-lead max-w-xl">{description}</p>
          <div className="surface-subtle mt-2 p-5">
            <p className="public-item-title">{noteTitle}</p>
            <p className="public-card-copy">{noteDescription}</p>
          </div>
        </div>

        <div className="surface-panel p-6 sm:p-7">
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="locale" value={locale} />

            {/* Honeypot: hidden from people, attractive to form bots. Kept out
                of the tab order and the accessibility tree. */}
            <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
              <label htmlFor={CONTACT_HONEYPOT_FIELD}>{fields.honeypot}</label>
              <input
                id={CONTACT_HONEYPOT_FIELD}
                name={CONTACT_HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{fields.name}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={fields.namePlaceholder}
                  autoComplete="name"
                  maxLength={120}
                  required
                  size="lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{fields.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={fields.emailPlaceholder}
                  autoComplete="email"
                  maxLength={200}
                  required
                  size="lg"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
              <div className="space-y-2">
                <Label htmlFor="reason">{fields.reason}</Label>
                <Select id="reason" name="reason" defaultValue="general" size="lg">
                  <option value="general">{fields.reasonOptions.general}</option>
                  <option value="partnerships">
                    {fields.reasonOptions.partnerships}
                  </option>
                  <option value="visit">{fields.reasonOptions.visit}</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">{fields.subject}</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder={fields.subjectPlaceholder}
                  maxLength={200}
                  required
                  size="lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{fields.message}</Label>
              <Textarea
                id="message"
                name="message"
                placeholder={fields.messagePlaceholder}
                minLength={20}
                maxLength={5000}
                required
                size="lg"
                className="min-h-[12rem]"
              />
            </div>

            <div aria-live="polite" role="status">
              {message && state.status === "error" ? (
                <div className="rounded-sm border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
                  {message}
                </div>
              ) : null}

              {message && state.status === "success" ? (
                <div className="rounded-sm border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground">
                  {message}
                </div>
              ) : null}
            </div>

            <SubmitButton
              className="w-full sm:w-auto"
              variant="hero"
              size="lg"
              pendingLabel={fields.pending}
            >
              {fields.submit}
            </SubmitButton>
          </form>
        </div>
      </div>
    </section>
  );
}
