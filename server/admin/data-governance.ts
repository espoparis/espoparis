export type SourceSystem =
  | "google-form"
  | "language-sheet"
  | "central-enrollment"
  | "student-portal"
  | "google-classroom"
  | "google-drive"
  | "payment-provider"
  | "admin";

export type StudentLifecycleStatus =
  | "applicant"
  | "accepted"
  | "active"
  | "paused"
  | "completed"
  | "withdrawn"
  | "rejected";

export type CanonicalStudentRecord = {
  applicationId: string;
  internalUserId?: string;
  fullName: string;
  email: string;
  language?: string;
  academicYear: string;
  yearLevel?: 1 | 2 | 3 | 4;
  semester?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  status: StudentLifecycleStatus;
  source: "central-enrollment";
};

export type ImportRow = {
  rowNumber: number;
  applicationId?: string;
  fullName?: string;
  email?: string;
  language?: string;
  academicYear?: string;
  status?: string;
};

export type DataQualityIssue = {
  rowNumber: number;
  field: "applicationId" | "fullName" | "email" | "academicYear" | "status";
  code:
    | "missing-required"
    | "invalid-email"
    | "duplicate-application-id"
    | "duplicate-email"
    | "unknown-status";
  severity: "error" | "warning";
  message: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function auditEnrollmentRows(rows: ImportRow[]): DataQualityIssue[] {
  const issues: DataQualityIssue[] = [];
  const ids = new Map<string, number>();
  const emails = new Map<string, number>();
  const allowedStatuses = new Set(["applicant", "accepted", "active", "paused", "completed", "withdrawn", "rejected"]);

  for (const row of rows) {
    if (!row.applicationId?.trim()) {
      issues.push({ rowNumber: row.rowNumber, field: "applicationId", code: "missing-required", severity: "error", message: "Application ID is required." });
    } else {
      const id = row.applicationId.trim();
      if (ids.has(id)) {
        issues.push({ rowNumber: row.rowNumber, field: "applicationId", code: "duplicate-application-id", severity: "error", message: `Application ID duplicates row ${ids.get(id)}.` });
      } else ids.set(id, row.rowNumber);
    }

    if (!row.fullName?.trim()) {
      issues.push({ rowNumber: row.rowNumber, field: "fullName", code: "missing-required", severity: "error", message: "Full name is required." });
    }

    if (!row.email?.trim()) {
      issues.push({ rowNumber: row.rowNumber, field: "email", code: "missing-required", severity: "error", message: "Email is required." });
    } else {
      const email = normalizeEmail(row.email);
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        issues.push({ rowNumber: row.rowNumber, field: "email", code: "invalid-email", severity: "error", message: "Email format is invalid." });
      }
      if (emails.has(email)) {
        issues.push({ rowNumber: row.rowNumber, field: "email", code: "duplicate-email", severity: "warning", message: `Email also appears on row ${emails.get(email)}.` });
      } else emails.set(email, row.rowNumber);
    }

    if (!row.academicYear?.trim()) {
      issues.push({ rowNumber: row.rowNumber, field: "academicYear", code: "missing-required", severity: "error", message: "Academic year is required." });
    }

    if (row.status && !allowedStatuses.has(row.status)) {
      issues.push({ rowNumber: row.rowNumber, field: "status", code: "unknown-status", severity: "warning", message: "Status is not in the canonical lifecycle list." });
    }
  }

  return issues;
}

export function canImportRows(rows: ImportRow[]) {
  return !auditEnrollmentRows(rows).some((issue) => issue.severity === "error");
}

export type AuditEvent = {
  id: string;
  actorUserId: string;
  action: string;
  entityType: "student" | "enrollment" | "subject" | "grade" | "attendance" | "payment" | "entitlement" | "curriculum";
  entityId: string;
  occurredAt: Date;
  source: SourceSystem;
  reason?: string;
  before?: unknown;
  after?: unknown;
};

/**
 * Sensitive academic changes must be attributable. A production repository
 * should persist this event atomically with the corresponding mutation.
 */
export function createAuditEvent(input: Omit<AuditEvent, "id" | "occurredAt"> & { occurredAt?: Date }): AuditEvent {
  const occurredAt = input.occurredAt ?? new Date();
  const token = `${input.actorUserId}:${input.action}:${input.entityType}:${input.entityId}:${occurredAt.toISOString()}`;
  const id = `audit-${Buffer.from(token).toString("base64url").slice(0, 24)}`;
  return { ...input, occurredAt, id };
}
