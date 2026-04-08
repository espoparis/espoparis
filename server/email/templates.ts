import { siteConfig } from "@/lib/site-config";
import type { ContactInquiryInput } from "@/lib/validation/contact";

type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

type BaseTemplateInput = {
  preview: string;
  heading: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
  outro?: string;
};

function renderEmailTemplate(input: BaseTemplateInput): EmailTemplate {
  const footer = siteConfig.name;
  const ctaMarkup =
    input.ctaLabel && input.ctaHref
      ? `<p style="margin:24px 0;"><a href="${input.ctaHref}" style="display:inline-block;border-radius:999px;background:#0f172a;color:#ffffff;padding:12px 20px;text-decoration:none;font-weight:600;">${input.ctaLabel}</a></p>`
      : "";
  const textCta =
    input.ctaLabel && input.ctaHref ? `\n\n${input.ctaLabel}: ${input.ctaHref}` : "";
  const outro = input.outro ?? "Thanks for learning with us.";

  return {
    subject: input.heading,
    html: `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">${footer}</p>
          <p style="margin:0 0 16px;font-size:14px;color:#475569;">${input.preview}</p>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.15;">${input.heading}</h1>
          <p style="margin:0;font-size:16px;line-height:1.7;color:#334155;">${input.intro}</p>
          ${ctaMarkup}
          <p style="margin:24px 0 0;font-size:15px;line-height:1.7;color:#475569;">${outro}</p>
        </div>
      </div>
    `,
    text: `${input.preview}\n\n${input.heading}\n\n${input.intro}${textCta}\n\n${outro}\n\n${footer}`,
  };
}

export function buildContactInquiryEmail(input: ContactInquiryInput): EmailTemplate {
  const reasonLabels: Record<ContactInquiryInput["reason"], string> = {
    general: "General enquiry",
    partnerships: "Partnerships",
    visit: "Visit planning",
  };

  const subject = `Contact enquiry: ${input.subject}`;

  return {
    subject,
    html: `
      <div style="margin:0;padding:32px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e2e8f0;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;">${siteConfig.name}</p>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.15;">${subject}</h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#334155;">A new message was sent through the public contact page.</p>
          <div style="display:grid;gap:12px;margin:0 0 24px;">
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Name:</strong> ${input.name}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Email:</strong> ${input.email}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Reason:</strong> ${reasonLabels[input.reason]}</p>
            <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Subject:</strong> ${input.subject}</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:18px;padding:20px;background:#f8fafc;">
            <p style="margin:0;font-size:15px;line-height:1.8;color:#334155;white-space:pre-wrap;">${input.message}</p>
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
      "",
      input.message,
    ].join("\n"),
  };
}
