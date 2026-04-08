import "server-only";

import { getSiteUrl } from "@/lib/env";
import type { ApprovalStatus, EnrollmentStatus } from "@/lib/types/database";
import { getAuthUserEmailById } from "@/server/repositories/auth-users";
import {
  buildApprovalStatusEmail,
  buildEnrollmentDecisionEmail,
  buildPendingRegistrationEmail,
} from "@/server/email/templates";
import { sendTransactionalEmail } from "@/server/email/resend";

export async function sendPendingRegistrationNotification(input: {
  email: string;
  fullName: string;
  role: "student" | "teacher";
  locale: string;
}) {
  const template = buildPendingRegistrationEmail({
    ...input,
    siteUrl: getSiteUrl(),
  });

  return sendTransactionalEmail({
    to: input.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendProfileApprovalNotification(input: {
  profileId: string;
  fullName: string;
  status: ApprovalStatus;
  locale: string;
}) {
  const email = await getAuthUserEmailById(input.profileId);

  if (!email) {
    return { skipped: true as const };
  }

  const template = buildApprovalStatusEmail({
    ...input,
    siteUrl: getSiteUrl(),
  });

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendEnrollmentDecisionNotification(input: {
  studentId: string;
  studentName: string;
  courseTitle: string;
  status: EnrollmentStatus;
  locale: string;
}) {
  const email = await getAuthUserEmailById(input.studentId);

  if (!email) {
    return { skipped: true as const };
  }

  const template = buildEnrollmentDecisionEmail({
    fullName: input.studentName,
    courseTitle: input.courseTitle,
    status: input.status,
    locale: input.locale,
    siteUrl: getSiteUrl(),
  });

  return sendTransactionalEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
