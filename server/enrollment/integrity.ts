export type EnrollmentIntegrityRow = {
  rowNumber: number;
  applicationId: string;
  fullName: string;
  email: string;
  status: string;
  studentFolder: string;
  language?: string;
};

export type EnrollmentIntegrityIssue = {
  rowNumber: number;
  applicationId?: string;
  code: "missing-name" | "missing-email" | "duplicate-email" | "duplicate-id" | "unknown-folder" | "invalid-id";
  severity: "error" | "warning";
};

export type EnrollmentIntegritySummary = {
  total: number;
  healthy: number;
  errors: number;
  warnings: number;
  issues: EnrollmentIntegrityIssue[];
};

function emailKey(value: string) { return value.trim().toLowerCase(); }

export function auditEnrollmentIntegrity(rows: EnrollmentIntegrityRow[]): EnrollmentIntegritySummary {
  const issues: EnrollmentIntegrityIssue[] = [];
  const emails = new Map<string, number>();
  const ids = new Map<string, number>();
  const broken = new Set<number>();

  for (const row of rows) {
    const id = row.applicationId.trim();
    const email = emailKey(row.email);
    if (!/^AIC-\d{4}-\d{4,6}$/.test(id)) issues.push({ rowNumber: row.rowNumber, applicationId: id || undefined, code: "invalid-id", severity: "error" });
    if (!row.fullName.trim()) issues.push({ rowNumber: row.rowNumber, applicationId: id || undefined, code: "missing-name", severity: "error" });
    if (!email) issues.push({ rowNumber: row.rowNumber, applicationId: id || undefined, code: "missing-email", severity: "error" });
    if (id) {
      const prior = ids.get(id);
      if (prior) issues.push({ rowNumber: row.rowNumber, applicationId: id, code: "duplicate-id", severity: "error" });
      else ids.set(id, row.rowNumber);
    }
    if (email) {
      const prior = emails.get(email);
      if (prior) issues.push({ rowNumber: row.rowNumber, applicationId: id || undefined, code: "duplicate-email", severity: "warning" });
      else emails.set(email, row.rowNumber);
    }
    if (/unknown student/i.test(row.studentFolder)) issues.push({ rowNumber: row.rowNumber, applicationId: id || undefined, code: "unknown-folder", severity: "warning" });
  }

  for (const issue of issues) broken.add(issue.rowNumber);
  return {
    total: rows.length,
    healthy: rows.length - broken.size,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    issues,
  };
}

export function canAutoLinkAccount(input: { verifiedEmail: string; recordEmail: string; recordStatus: string; fullName: string }) {
  const status = input.recordStatus.trim().toLowerCase();
  return Boolean(
    input.fullName.trim() &&
    emailKey(input.verifiedEmail) &&
    emailKey(input.verifiedEmail) === emailKey(input.recordEmail) &&
    ["accepted", "active"].includes(status)
  );
}
