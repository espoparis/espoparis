import { localizePath } from "@/lib/constants/app";
import { siteConfig } from "@/lib/site-config";
import type { ApprovalStatus, EnrollmentStatus } from "@/lib/types/database";

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

export function buildPendingRegistrationEmail(input: {
  fullName: string;
  role: "student" | "teacher";
  locale: string;
  siteUrl: string;
}): EmailTemplate {
  const roleLabel = input.role === "teacher" ? "teacher" : "student";
  const href = `${input.siteUrl}${localizePath(input.locale, "/pending")}`;

  return renderEmailTemplate({
    preview: "Your account is created and waiting for approval.",
    heading: `You’re on the list, ${input.fullName}`,
    intro: `Your ${roleLabel} account has been created successfully. An admin will review it before you can access the full workspace.`,
    ctaLabel: "View status",
    ctaHref: href,
    outro: "We’ll email you again as soon as your account status changes.",
  });
}

export function buildApprovalStatusEmail(input: {
  fullName: string;
  status: ApprovalStatus;
  locale: string;
  siteUrl: string;
}): EmailTemplate {
  const href =
    input.status === "approved"
      ? `${input.siteUrl}${localizePath(input.locale, "/dashboard")}`
      : `${input.siteUrl}${localizePath(input.locale, "/pending")}`;

  if (input.status === "approved") {
    return renderEmailTemplate({
      preview: "Your account has been approved.",
      heading: "Your account is now active",
      intro: `${input.fullName}, your access request has been approved. You can now sign in and start using your workspace.`,
      ctaLabel: "Open dashboard",
      ctaHref: href,
      outro: "If anything looks off after signing in, reply to this email and we’ll help.",
    });
  }

  return renderEmailTemplate({
    preview: "There’s an update on your account request.",
    heading: "Your request was not approved",
    intro: `${input.fullName}, your account request was reviewed but wasn’t approved at this time. You can still sign in to check your status or contact support for the next step.`,
    ctaLabel: "Review status",
    ctaHref: href,
    outro: "You can update your information later and request access again if needed.",
  });
}

export function buildEnrollmentDecisionEmail(input: {
  fullName: string;
  courseTitle: string;
  status: EnrollmentStatus;
  locale: string;
  siteUrl: string;
}): EmailTemplate {
  const href =
    input.status === "approved"
      ? `${input.siteUrl}${localizePath(input.locale, "/student/courses")}`
      : `${input.siteUrl}${localizePath(input.locale, "/student/applications")}`;

  if (input.status === "approved") {
    return renderEmailTemplate({
      preview: "Your course application has been approved.",
      heading: `You’re in: ${input.courseTitle}`,
      intro: `${input.fullName}, your application for ${input.courseTitle} has been approved. Your course materials are now available in your student workspace.`,
      ctaLabel: "Open my courses",
      ctaHref: href,
      outro: "Enjoy the course, and keep an eye on your dashboard for new materials and updates.",
    });
  }

  return renderEmailTemplate({
    preview: "There’s an update on your course application.",
    heading: `Application update for ${input.courseTitle}`,
    intro: `${input.fullName}, your application for ${input.courseTitle} was not approved. You can review your application history and apply to other courses anytime.`,
    ctaLabel: "View applications",
    ctaHref: href,
    outro: "If you need help choosing another course, we’ll be happy to help.",
  });
}
