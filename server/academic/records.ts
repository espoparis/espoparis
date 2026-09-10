export type GradeScale = "percentage" | "points" | "pass-fail" | "letter";
export type AcademicStanding = "in-progress" | "passed" | "conditional" | "failed" | "completed";
export type AttendanceStatus = "present" | "absent" | "excused" | "late";

export type CourseGrade = {
  enrollmentId: string;
  courseOfferingId: string;
  scale: GradeScale;
  earned: number | string | boolean | null;
  possible?: number;
  published: boolean;
  publishedAt?: Date;
  notes?: string;
};

export type AttendanceEntry = {
  enrollmentId: string;
  lessonId: string;
  status: AttendanceStatus;
  recordedAt: Date;
  source: "classroom" | "meet" | "admin" | "import";
};

export type AcademicTermRecord = {
  enrollmentId: string;
  academicYear: string;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  standing: AcademicStanding;
  average?: number;
  completedCourseIds: string[];
};

export type ProgressionDecision = {
  enrollmentId: string;
  fromYearLevel: 1 | 2 | 3 | 4;
  fromSemester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  nextYearLevel?: 1 | 2 | 3 | 4;
  nextSemester?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  decision: "promote" | "repeat" | "hold" | "complete-program";
  approvedByUserId: string;
  approvedAt: Date;
  reason?: string;
};

/**
 * Progression is intentionally approval-based. Grades/attendance may produce a
 * recommendation, but the system must not silently promote a student because
 * institutional rules can change and exceptional cases require review.
 */
export function recommendNextTerm(input: {
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  standing: AcademicStanding;
}) {
  if (input.standing !== "passed" && input.standing !== "completed") {
    return { decision: "hold" as const };
  }

  if (input.semester === 8 || input.yearLevel === 4 && input.semester >= 8) {
    return { decision: "complete-program" as const };
  }

  const nextSemester = (input.semester + 1) as 2 | 3 | 4 | 5 | 6 | 7 | 8;
  const nextYearLevel = Math.ceil(nextSemester / 2) as 1 | 2 | 3 | 4;
  return { decision: "promote" as const, nextSemester, nextYearLevel };
}
