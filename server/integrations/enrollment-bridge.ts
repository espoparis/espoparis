import { randomUUID } from "node:crypto";
import { callAppsScript } from "./apps-script-client";

export type EnrollmentBridgeRecord = {
  applicationId: string;
  submissionDate: string;
  language: string;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  educationLevel?: string;
  academicDegree?: string;
  latestCertificate?: string;
  hawzaStudies?: string;
  primaryLanguage?: string;
  countryCity?: string;
  phone?: string;
  status: string;
  studentFolder?: string;
};

export async function lookupEnrollmentByEmail(input: {
  url: string;
  secret: string;
  email: string;
}) {
  const response = await callAppsScript<
    { email: string },
    { ok: boolean; result?: EnrollmentBridgeRecord | null; error?: string }
  >({
    url: input.url,
    secret: input.secret,
    action: "student.lookup",
    data: { email: input.email.trim().toLowerCase() },
    nonce: randomUUID(),
  });

  if (!response.ok) throw new Error(response.error || "Enrollment bridge lookup failed.");
  return response.result ?? null;
}
