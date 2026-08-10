import "server-only";

import { getOptionalEmailEnv } from "@/lib/env";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  /** Overrides the configured reply-to, e.g. to answer an enquirer directly. */
  replyTo?: string;
};

export async function sendTransactionalEmail(input: SendEmailInput) {
  const env = getOptionalEmailEnv();

  if (!env) {
    return { skipped: true as const };
  }

  const replyTo = input.replyTo ?? env.replyToEmail;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.fromEmail,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    // Resend error bodies can echo request content, so keep them out of any
    // response that reaches the browser. The caller logs this server-side only.
    const message = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${message}`);
  }

  return { skipped: false as const };
}
