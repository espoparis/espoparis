import type { AcademicEnrollment } from "@/server/academic/types";
import type { CourseGrade, AttendanceEntry } from "@/server/academic/records";

export type AcademicOperation =
  | "view-students"
  | "edit-enrollment"
  | "edit-curriculum"
  | "enter-grades"
  | "publish-grades"
  | "record-attendance"
  | "approve-progression"
  | "confirm-offline-payment"
  | "manage-entitlements";

export type AcademicOperatorRole = "teacher" | "academic-officer" | "finance" | "editor" | "admin";

const permissions: Record<AcademicOperatorRole, ReadonlySet<AcademicOperation>> = {
  teacher: new Set(["view-students", "enter-grades", "record-attendance"]),
  "academic-officer": new Set(["view-students", "edit-enrollment", "edit-curriculum", "enter-grades", "publish-grades", "record-attendance", "approve-progression", "manage-entitlements"]),
  finance: new Set(["view-students", "confirm-offline-payment"]),
  editor: new Set([]),
  admin: new Set(["view-students", "edit-enrollment", "edit-curriculum", "enter-grades", "publish-grades", "record-attendance", "approve-progression", "confirm-offline-payment", "manage-entitlements"]),
};

export function canPerformAcademicOperation(role: AcademicOperatorRole, operation: AcademicOperation) {
  return permissions[role].has(operation);
}

export type StudentAcademicSnapshot = {
  enrollment: AcademicEnrollment;
  grades: CourseGrade[];
  attendance: AttendanceEntry[];
};

export function summarizeAttendance(entries: AttendanceEntry[]) {
  const total = entries.length;
  if (!total) return { total: 0, present: 0, absent: 0, excused: 0, late: 0, attendanceRate: null as number | null };
  const counts = { present: 0, absent: 0, excused: 0, late: 0 };
  for (const entry of entries) counts[entry.status] += 1;
  const effectivePresent = counts.present + counts.late;
  return { total, ...counts, attendanceRate: Math.round((effectivePresent / total) * 10000) / 100 };
}

export function publishedGradesOnly(grades: CourseGrade[]) {
  return grades.filter((grade) => grade.published);
}
