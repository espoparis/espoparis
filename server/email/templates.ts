import { siteConfig } from "@/lib/site-config";
import { escapeHtml, escapeHtmlWithBreaks } from "@/server/email/escape";
import type { ContactInquiryInput } from "@/lib/validation/contact";

type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

export function buildContactInquiryEmail(input: ContactInquiryInput): EmailTemplate {
  const reasonLabels: Record<ContactInquiryInput["reason"], string> = {
    general: "General enquiry",
    partnerships: "Partnerships",
    visit: "Visit planning",
  };

  const subject = `Contact enquiry: ${input.subject}`;

  // Every interpolated value below originates from a public form submission, so
  // each one is HTML-escaped before it reaches the markup.
  const safe = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    subject: escapeHtml(input.subject),
    reason: escapeHtml(reasonLabels[input.reason]),
    locale: escapeHtml(input.locale),
    message: escapeHtmlWithBreaks(input.message),
    heading: escapeHtml(subject),
  };

  return {
    subject,
    html: `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">${escapeHtml(siteConfig.name)}</p>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.15;">${safe.heading}</h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#334155;">A new message was sent through the public contact page.</p>
          <div style="display:grid;gap:12px;margin:0 0 24px;">
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Name:</strong> ${safe.name}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Email:</strong> ${safe.email}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Reason:</strong> ${safe.reason}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Subject:</strong> ${safe.subject}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Language:</strong> ${safe.locale}</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:18px;padding:20px;background:#f8fafc;">
            <p style="margin:0;font-size:15px;line-height:1.8;color:#334155;">${safe.message}</p>
          </div>
        </div>
      </div>
    `,
    text: [
      siteConfig.name,
      "",
      subject,
      "",
      "A new message was sent through the public contact page.",
      "",
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Reason: ${reasonLabels[input.reason]}`,
      `Subject: ${input.subject}`,
      `Language: ${input.locale}`,
      "",
      input.message,
    ].join("\n"),
  };
}
