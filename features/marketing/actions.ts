"use server";

import { headers, type UnsafeUnwrappedHeaders } from "next/headers";
import {
  CONTACT_HONEYPOT_FIELD,
  contactInquirySchema,
} from "@/lib/validation/contact";
import { isEmailConfigured } from "@/lib/env";
import { checkRateLimit } from "@/server/rate-limit";
import { sendContactInquiryNotification } from "@/server/email/contact";

/**
 * `messageKey` is resolved client-side under `contact.form.status` (or
 * `contact.form.errors` for field-level failures) so every response is shown in
 * the visitor's language.
 */
export type ActionState = {
  status: "idle" | "error" | "success";
  messageKey?: string;
};

export const initialContactState: ActionState = { status: "idle" };

const RATE_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 };

function getClientKey() {
  const headerList = (headers() as unknown as UnsafeUnwrappedHeaders);
  const forwarded =
    headerList.get("x-vercel-forwarded-for") ??
    headerList.get("x-forwarded-for") ??
    headerList.get("x-real-ip");

  // `x-forwarded-for` is a client-to-proxy chain; the first entry is the origin.
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function submitContactInquiryAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Bots fill every field they can see, including the visually hidden one.
  // Report success so automated submitters get no signal to adapt.
  if ((formData.get(CONTACT_HONEYPOT_FIELD) as string | null)?.trim()) {
    return { status: "success", messageKey: "success" };
  }

  const rateLimit = checkRateLimit(getClientKey(), RATE_LIMIT);

  if (!rateLimit.allowed) {
    return { status: "error", messageKey: "rateLimited" };
  }

  const parsed = contactInquirySchema.safeParse({
    locale: formData.get("locale"),
    name: formData.get("name"),
    email: formData.get("email"),
    reason: formData.get("reason"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", messageKey: parsed.error.issues[0]?.message };
  }

  if (!isEmailConfigured()) {
    return { status: "error", messageKey: "notConfigured" };
  }

  try {
    await sendContactInquiryNotification(parsed.data);
    return { status: "success", messageKey: "success" };
  } catch (error) {
    console.error("Failed to send contact inquiry", error);
    return { status: "error", messageKey: "failed" };
  }
}
