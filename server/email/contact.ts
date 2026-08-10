import "server-only";

import { siteConfig } from "@/lib/site-config";
import { sendTransactionalEmail } from "@/server/email/resend";
import { buildContactInquiryEmail } from "@/server/email/templates";
import type { ContactInquiryInput } from "@/lib/validation/contact";

export async function sendContactInquiryNotification(input: ContactInquiryInput) {
  const template = buildContactInquiryEmail(input);

  return sendTransactionalEmail({
    to: siteConfig.contact.primaryEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    // Replying to the notification should reach the person who wrote in.
    replyTo: input.email,
  });
}
