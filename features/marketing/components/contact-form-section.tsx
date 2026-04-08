"use client";

import { useFormState } from "react-dom";
import { MessageSquareText } from "lucide-react";
import { submitContactInquiryAction, type ActionState } from "@/features/marketing/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = {};

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
  const [state, formAction] = useFormState(submitContactInquiryAction, initialState);

  return (
    <section className="py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-12">
        <div className="space-y-4">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="max-w-xl font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>

          <div className="surface-panel max-w-xl p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
              {noteTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              {noteDescription}
            </p>
          </div>
        </div>

        <div className="surface-panel p-6 sm:p-7">
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="locale" value={locale} />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{fields.name}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={fields.namePlaceholder}
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
                  <option value="partnerships">{fields.reasonOptions.partnerships}</option>
                  <option value="visit">{fields.reasonOptions.visit}</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">{fields.subject}</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder={fields.subjectPlaceholder}
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
                required
                size="lg"
                className="min-h-[12rem]"
              />
            </div>

            {state.error ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
                {state.error}
              </div>
            ) : null}

            {state.success ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground">
                {state.success}
              </div>
            ) : null}

            <SubmitButton className="w-full sm:w-auto" variant="hero" size="lg" pendingLabel={fields.pending}>
              {fields.submit}
            </SubmitButton>
          </form>
        </div>
      </div>
    </section>
  );
}
