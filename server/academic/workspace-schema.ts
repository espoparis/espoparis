export const academicWorkspaceSheets = {
  offerings: {
    name: "Course Offerings",
    headers: ["Offering Id", "Course Id", "Academic Year", "Semester", "Teacher Email", "Status"],
    required: ["Offering Id", "Course Id", "Academic Year", "Semester", "Teacher Email", "Status"],
  },
  assessments: {
    name: "Assessments",
    headers: ["Assessment Id", "Offering Id", "Title", "Kind", "Max Score", "Weight %", "Active"],
    required: ["Assessment Id", "Offering Id", "Title", "Max Score", "Weight %", "Active"],
  },
  grades: {
    name: "Gradebook",
    headers: ["Grade Key", "Enrollment Id", "AIC Id", "Offering Id", "Assessment Id", "Score", "Status", "Entered By", "Entered At", "Approved By", "Approved At", "Published At", "Note"],
    required: ["Grade Key", "Enrollment Id", "AIC Id", "Offering Id", "Assessment Id", "Status"],
  },
  attendance: {
    name: "Attendance",
    headers: ["Attendance Key", "Enrollment Id", "AIC Id", "Offering Id", "Lesson Id", "Status", "Recorded By", "Recorded At", "Source"],
    required: ["Attendance Key", "Enrollment Id", "AIC Id", "Offering Id", "Lesson Id", "Status"],
  },
  staff: {
    name: "Staff Access",
    headers: ["Email", "Role", "Active", "Allowed Offering Ids"],
    required: ["Email", "Role", "Active"],
  },
  audit: {
    name: "Academic Audit Log",
    headers: ["Timestamp", "Actor", "Action", "Resource Type", "Resource Id", "Before", "After"],
    required: ["Timestamp", "Actor", "Action", "Resource Type", "Resource Id"],
  },
} as const;

export type AcademicWorkspaceSheetKey = keyof typeof academicWorkspaceSheets;

export const academicWorkspaceEnums = {
  offeringStatus: ["draft", "active", "closed", "archived"],
  staffRole: ["teacher", "academic-officer", "finance", "editor", "admin"],
  gradeStatus: ["draft", "submitted", "returned", "approved", "published"],
  attendanceStatus: ["present", "absent", "excused", "late"],
  activeFlag: ["TRUE", "FALSE"],
} as const;

export type WorkspaceHealthIssue = {
  sheet: string;
  code: "missing-sheet" | "missing-header" | "duplicate-header" | "unexpected-order";
  detail: string;
  blocking: boolean;
};

export function auditAcademicWorkspace(input: Record<string, string[] | undefined>): WorkspaceHealthIssue[] {
  const issues: WorkspaceHealthIssue[] = [];

  for (const sheet of Object.values(academicWorkspaceSheets)) {
    const actual = input[sheet.name];
    if (!actual) {
      issues.push({ sheet: sheet.name, code: "missing-sheet", detail: `${sheet.name} is missing.`, blocking: true });
      continue;
    }

    const seen = new Set<string>();
    for (const header of actual) {
      const normalized = header.trim();
      if (seen.has(normalized)) {
        issues.push({ sheet: sheet.name, code: "duplicate-header", detail: `Duplicate header: ${normalized}`, blocking: true });
      }
      seen.add(normalized);
    }

    for (const required of sheet.required) {
      if (!seen.has(required)) {
        issues.push({ sheet: sheet.name, code: "missing-header", detail: `Required header is missing: ${required}`, blocking: true });
      }
    }

    const canonical = sheet.headers.join("\u001f");
    const currentCanonicalSlice = actual.slice(0, sheet.headers.length).join("\u001f");
    if (canonical !== currentCanonicalSlice && sheet.headers.every((header) => seen.has(header))) {
      issues.push({ sheet: sheet.name, code: "unexpected-order", detail: "Headers exist but are not in the canonical order.", blocking: false });
    }
  }

  return issues;
}

export function academicWorkspaceReady(issues: WorkspaceHealthIssue[]) {
  return !issues.some((issue) => issue.blocking);
}

export function assertAssessmentWeights(weights: Array<{ active: boolean; weight: number }>) {
  const active = weights.filter((item) => item.active);
  if (active.some((item) => !Number.isFinite(item.weight) || item.weight < 0 || item.weight > 100)) {
    return { valid: false, total: NaN, reason: "invalid-weight" as const };
  }
  const total = active.reduce((sum, item) => sum + item.weight, 0);
  return {
    valid: Math.abs(total - 100) < 0.0001,
    total,
    reason: Math.abs(total - 100) < 0.0001 ? null : ("weight-total" as const),
  };
}
