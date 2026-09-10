export type AcademicWriteRole = "teacher" | "academic-officer" | "admin";
export type AcademicWriteAction =
  | "grade.save-draft"
  | "grade.submit"
  | "grade.approve"
  | "grade.return"
  | "grade.publish"
  | "attendance.record";

export type StaffAcademicAccess = {
  email: string;
  role: AcademicWriteRole;
  active: boolean;
  offeringIds: string[];
};

export function normalizeStaffEmail(value: string) {
  return value.trim().toLowerCase();
}

export function canPerformAcademicWrite(input: {
  staff: StaffAcademicAccess;
  action: AcademicWriteAction;
  offeringId: string;
}) {
  const { staff, action, offeringId } = input;
  if (!staff.active || !normalizeStaffEmail(staff.email)) return false;

  if (staff.role === "admin") return true;

  if (staff.role === "academic-officer") {
    return ["grade.approve", "grade.return", "grade.publish"].includes(action);
  }

  if (staff.role === "teacher") {
    const teacherAction = action === "grade.save-draft" || action === "grade.submit" || action === "attendance.record";
    return teacherAction && staff.offeringIds.includes(offeringId);
  }

  return false;
}

export function gradeRecordKey(enrollmentId: string, assessmentId: string) {
  const enrollment = enrollmentId.trim();
  const assessment = assessmentId.trim();
  if (!enrollment || !assessment) throw new Error("Grade identity requires enrollment and assessment IDs.");
  return `${enrollment}::${assessment}`;
}

export function validateGradeScore(score: number | null, maxScore: number) {
  if (!Number.isFinite(maxScore) || maxScore <= 0) return { valid: false, reason: "invalid-max-score" as const };
  if (score === null) return { valid: true, reason: "empty-draft" as const };
  if (!Number.isFinite(score) || score < 0 || score > maxScore) return { valid: false, reason: "score-out-of-range" as const };
  return { valid: true, reason: "ok" as const };
}
