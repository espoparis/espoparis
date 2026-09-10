import { randomUUID } from "node:crypto";
import { normalizeEmail } from "./account.ts";

export type EnrollmentRecord = {
  id: string;
  applicantEmail: string;
  academicYear: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  status: "pending" | "accepted" | "active" | "suspended" | "graduated" | "withdrawn";
  userId?: string;
  studentNumber?: string;
};

export type EnrollmentMatchDecision =
  | { matched: true; reason: "accepted-email-match"; enrollmentId: string }
  | { matched: false; reason: "no-record" | "not-accepted" | "already-linked" };

export function matchEnrollmentByVerifiedEmail(
  verifiedEmail: string,
  enrollment: EnrollmentRecord | undefined,
): EnrollmentMatchDecision {
  if (!enrollment || normalizeEmail(enrollment.applicantEmail) !== normalizeEmail(verifiedEmail)) {
    return { matched: false, reason: "no-record" };
  }
  if (enrollment.userId) return { matched: false, reason: "already-linked" };
  if (!(["accepted", "active"] as const).includes(enrollment.status as "accepted" | "active")) {
    return { matched: false, reason: "not-accepted" };
  }
  return { matched: true, reason: "accepted-email-match", enrollmentId: enrollment.id };
}

export function linkEnrollmentToUser(
  enrollment: EnrollmentRecord,
  userId: string,
  studentNumber: string,
): EnrollmentRecord {
  return {
    ...enrollment,
    userId,
    studentNumber,
    status: enrollment.status === "accepted" ? "active" : enrollment.status,
  };
}

export function createEnrollmentId() {
  return randomUUID();
}

export function buildStudentNumber(sequence: number, academicYearStart = 2026) {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 999999) {
    throw new Error("Student number sequence must be an integer between 1 and 999999.");
  }
  return `ESPO-${academicYearStart}-${String(sequence).padStart(5, "0")}`;
}
