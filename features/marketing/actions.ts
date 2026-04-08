"use server";

import type { ActionState } from "@/features/auth/actions";
import { contactInquirySchema } from "@/lib/validation/contact";
import { isEmailConfigured } from "@/lib/env";
import { sendContactInquiryNotification } from "@/server/email/contact";

export async function submitContactInquiryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = contactInquirySchema.safeParse({
    locale: formData.get("locale"),
    name: formData.get("name"),
    email: formData.get("email"),
    reason: formData.get("reason"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  if (!isEmailConfigured()) {
    return {
      error:
        "Contact email is not configured yet. Please try again once email delivery is enabled.",
    };
  }

  try {
    await sendContactInquiryNotification(parsed.data);
    return { success: "Your message has been sent. The academy team will reply soon." };
  } catch (error) {
    console.error("Failed to send contact inquiry", error);
    return {
      error:
        "We could not send your message right now. Please try again in a moment.",
    };
  }
}
