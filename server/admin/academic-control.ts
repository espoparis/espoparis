import type { AcademicEnrollment, CourseOffering } from "@/server/academic/types";
import type { ProgressionDecision } from "@/server/academic/records";

export type CurriculumStatus = "draft" | "active" | "archived";
export type SubjectStatus = "active" | "inactive";

export type CurriculumVersion = {
  id: string;
  academicYear: string;
  label: string;
  status: CurriculumStatus;
  effectiveFrom: Date;
  effectiveTo?: Date;
};

export type CurriculumSubject = {
  id: string;
  curriculumVersionId: string;
  code?: string;
  name: string;
  description?: string;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  displayOrder: number;
  status: SubjectStatus;
};

export type AcademicAdminAction =
  | { type: "create-subject"; subject: CurriculumSubject }
  | { type: "update-subject"; subjectId: string; patch: Partial<Omit<CurriculumSubject, "id" | "curriculumVersionId">> }
  | { type: "deactivate-subject"; subjectId: string }
  | { type: "approve-progression"; decision: ProgressionDecision }
  | { type: "update-enrollment"; enrollmentId: string; patch: Partial<AcademicEnrollment> }
  | { type: "update-course-offering"; offeringId: string; patch: Partial<CourseOffering> };

/**
 * Curriculum edits are versioned. Historical student records keep the curriculum
 * version they were enrolled under, so renaming a subject next year does not
 * rewrite what a previous cohort actually studied.
 */
export function canMutateCurriculum(version: CurriculumVersion) {
  return version.status === "draft";
}

export function createNextCurriculumVersion(input: {
  current: CurriculumVersion;
  nextAcademicYear: string;
  effectiveFrom: Date;
}): CurriculumVersion {
  return {
    id: `curriculum-${input.nextAcademicYear}`,
    academicYear: input.nextAcademicYear,
    label: `Curriculum ${input.nextAcademicYear}`,
    status: "draft",
    effectiveFrom: input.effectiveFrom,
  };
}
