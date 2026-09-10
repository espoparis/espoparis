export type ReadinessStatus = "ready" | "blocked" | "manual";

export type ProductionGate = {
  id: string;
  label: string;
  status: ReadinessStatus;
  detail: string;
  blocking: boolean;
};

export type ProductionReadinessInput = {
  enrollmentAuditClean: boolean;
  enrollmentRepairVerified: boolean;
  appsScriptBridgeConfigured: boolean;
  authConfigured: boolean;
  staffAccessConfigured: boolean;
  academicSheetsConfigured: boolean;
  backupConfirmed: boolean;
  addressConfirmed: boolean;
  legalNameConfirmed: boolean;
};

export function buildProductionGates(input: ProductionReadinessInput): ProductionGate[] {
  return [
    {
      id: "backup",
      label: "Enrollment backup",
      status: input.backupConfirmed ? "ready" : "blocked",
      detail: input.backupConfirmed ? "A recoverable enrollment backup is confirmed." : "Create and verify a recoverable backup before any live repair.",
      blocking: true,
    },
    {
      id: "enrollment-audit",
      label: "Enrollment integrity audit",
      status: input.enrollmentAuditClean ? "ready" : "blocked",
      detail: input.enrollmentAuditClean ? "Central enrollment data passes the integrity audit." : "Resolve missing names, duplicate identities and broken folder names first.",
      blocking: true,
    },
    {
      id: "enrollment-repair",
      label: "Enrollment repair verification",
      status: input.enrollmentRepairVerified ? "ready" : "blocked",
      detail: input.enrollmentRepairVerified ? "Repair/backfill has been verified after a second audit." : "Run dry-run, controlled repair, then re-audit before account linking.",
      blocking: true,
    },
    {
      id: "bridge",
      label: "Signed Apps Script bridge",
      status: input.appsScriptBridgeConfigured ? "ready" : "blocked",
      detail: input.appsScriptBridgeConfigured ? "Vercel-to-Workspace signed bridge is configured." : "Configure deployment URLs and 32+ character signing secrets in server-only environment variables.",
      blocking: true,
    },
    {
      id: "auth",
      label: "Production authentication",
      status: input.authConfigured ? "ready" : "blocked",
      detail: input.authConfigured ? "Verified Google/email identity is available." : "Do not activate student/staff access until production authentication is configured.",
      blocking: true,
    },
    {
      id: "staff-access",
      label: "Staff authorization matrix",
      status: input.staffAccessConfigured ? "ready" : "blocked",
      detail: input.staffAccessConfigured ? "Teacher/officer/admin access is explicitly configured." : "Configure Staff Access before enabling academic write actions.",
      blocking: true,
    },
    {
      id: "academic-storage",
      label: "Academic records storage",
      status: input.academicSheetsConfigured ? "ready" : "blocked",
      detail: input.academicSheetsConfigured ? "Academic Sheets and audit log are provisioned." : "Provision Course Offerings, Assessments, Gradebook, Attendance and Audit Log before teacher writes.",
      blocking: true,
    },
    {
      id: "address",
      label: "Official address",
      status: input.addressConfirmed ? "ready" : "manual",
      detail: input.addressConfirmed ? "Public address is institutionally confirmed." : "Public launch may proceed only if the unconfirmed address is omitted; never publish a guessed address.",
      blocking: false,
    },
    {
      id: "legal-name",
      label: "Final public/legal naming",
      status: input.legalNameConfirmed ? "ready" : "manual",
      detail: input.legalNameConfirmed ? "SEO/legal naming is confirmed." : "Keep the current conservative naming until administration confirms the final legal/public identity.",
      blocking: false,
    },
  ];
}

export function canActivateStudentAccountLinking(gates: ProductionGate[]) {
  const required = new Set(["backup", "enrollment-audit", "enrollment-repair", "bridge", "auth"]);
  return [...required].every((id) => gates.find((gate) => gate.id === id)?.status === "ready");
}

export function canActivateAcademicWrites(gates: ProductionGate[]) {
  const required = new Set(["bridge", "auth", "staff-access", "academic-storage"]);
  return [...required].every((id) => gates.find((gate) => gate.id === id)?.status === "ready");
}
