import { z } from "zod";
import { routing } from "@/i18n/routing";

/**
 * Messages are translation keys rather than prose. The server action hands the
 * key back to the client, which resolves it under `contact.form.errors` so the
 * visitor sees the failure in their own language.
 */
export const contactInquirySchema = z.object({
  locale: z.enum(routing.locales, { message: "localeInvalid" }),
  name: z.string().trim().min(2, "nameRequired").max(120, "nameTooLong"),
  email: z.string().trim().email("emailInvalid").max(200, "emailTooLong"),
  reason: z.enum(["general", "partnerships", "visit"], { message: "reasonInvalid" }),
  subject: z.string().trim().min(4, "subjectRequired").max(200, "subjectTooLong"),
  message: z.string().trim().min(20, "messageTooShort").max(5000, "messageTooLong"),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

/**
 * Name of the hidden honeypot input. Real visitors never see the field, so any
 * submission that fills it is treated as automated.
 */
export const CONTACT_HONEYPOT_FIELD = "company";
