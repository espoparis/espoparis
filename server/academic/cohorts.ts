import type { EnrollmentRecord } from "../auth/enrollment-matching.ts";

export type CohortStatus = "planning" | "active" | "closed" | "archived";
export type CohortMemberStatus = "active" | "completed" | "withdrawn" | "suspended";

export type AcademicCohort = {
  id: string;
  academicYear: string;
  label: string;
  curriculumVersionId: string;
  status: CohortStatus;
  createdAt: string;
  activatedAt?: string;
  closedAt?: string;
};

export type CohortMembership = {
  id: string;
  cohortId: string;
  enrollmentId: string;
  studentId: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  status: CohortMemberStatus;
  startedAt: string;
  endedAt?: string;
};

export type RolloverCandidate = {
  enrollmentId: string;
  studentId: string;
  currentYearLevel: 1 | 2 | 3 | 4;
  currentSemester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  enrollmentStatus: EnrollmentRecord["status"];
  promotionApproved: boolean;
};

export type RolloverDecision =
  | { action: "advance"; nextYearLevel: 1 | 2 | 3 | 4; nextSemester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 }
  | { action: "complete-program" }
  | { action: "hold"; reason: string };

export function validateCohort(cohort: AcademicCohort): string[] {
  const issues: string[] = [];
  if (!cohort.id.trim()) issues.push("missing_cohort_id");
  if (!/^20\d{2}-20\d{2}$/.test(cohort.academicYear)) issues.push("invalid_academic_year");
  if (!cohort.label.trim()) issues.push("missing_label");
  if (!cohort.curriculumVersionId.trim()) issues.push("missing_curriculum_version_id");
  return issues;
}

export function canActivateCohort(cohort: AcademicCohort, curriculumStatus: "draft" | "active" | "archived") {
  return cohort.status === "planning" && curriculumStatus === "active" && validateCohort(cohort).length === 0;
}

export function activateCohort(cohort: AcademicCohort, curriculumStatus: "draft" | "active" | "archived", activatedAt: string): AcademicCohort {
  if (!canActivateCohort(cohort, curriculumStatus)) throw new Error("cohort_not_ready_for_activation");
  return { ...cohort, status: "active", activatedAt };
}

export function decideRollover(candidate: RolloverCandidate): RolloverDecision {
  if (candidate.enrollmentStatus !== "accepted" && candidate.enrollmentStatus !== "active") {
    return { action: "hold", reason: "enrollment_not_active" };
  }
  if (!candidate.promotionApproved) return { action: "hold", reason: "promotion_not_approved" };
  if (candidate.currentSemester === 8) return { action: "complete-program" };

  const nextSemester = (candidate.currentSemester + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  const nextYearLevel = Math.ceil(nextSemester / 2) as 1 | 2 | 3 | 4;
  return { action: "advance", nextYearLevel, nextSemester };
}

export function createNextMembership(current: CohortMembership, nextCohortId: string, decision: RolloverDecision, startedAt: string): CohortMembership | null {
  if (decision.action !== "advance") return null;
  return {
    id: `${nextCohortId}:${current.enrollmentId}`,
    cohortId: nextCohortId,
    enrollmentId: current.enrollmentId,
    studentId: current.studentId,
    yearLevel: decision.nextYearLevel,
    semester: decision.nextSemester,
    status: "active",
    startedAt,
  };
}

export function closeMembership(current: CohortMembership, endedAt: string, completed = false): CohortMembership {
  if (current.status !== "active") throw new Error("only_active_membership_can_close");
  return { ...current, status: completed ? "completed" : current.status, endedAt };
}
