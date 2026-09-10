export type RepairBlocker = {
  type: string;
  message: string;
  email?: string;
  applicationId?: string;
};

export type EnrollmentRepairAudit = {
  auditToken: string;
  canApply: boolean;
  blockers: RepairBlocker[];
  proposals: unknown[];
};

export function canApplyEnrollmentRepair(audit: EnrollmentRepairAudit) {
  return Boolean(audit.auditToken.trim()) && audit.canApply && audit.blockers.length === 0;
}

export function assertEnrollmentRepairPreconditions(input: {
  confirmation: string;
  audit: EnrollmentRepairAudit;
  suppliedAuditToken: string;
}) {
  if (input.confirmation !== "APPLY-ENROLLMENT-REPAIR") {
    throw new Error("Explicit enrollment repair confirmation is required.");
  }
  if (!canApplyEnrollmentRepair(input.audit)) {
    throw new Error("Enrollment repair is blocked until the audit has zero blockers.");
  }
  if (!input.suppliedAuditToken || input.suppliedAuditToken !== input.audit.auditToken) {
    throw new Error("Enrollment audit is stale. Run a new dry-run audit before repair.");
  }
  return true;
}
