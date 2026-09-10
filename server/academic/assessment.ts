export type AssessmentKind = "quiz" | "assignment" | "midterm" | "final" | "participation" | "other";
export type GradeEntryStatus = "draft" | "submitted" | "approved" | "published" | "returned";

export type AssessmentItem = {
  id: string;
  courseOfferingId: string;
  title: string;
  kind: AssessmentKind;
  maxScore: number;
  weightPercent: number;
  dueAt?: Date;
  active: boolean;
};

export type StudentAssessmentGrade = {
  enrollmentId: string;
  assessmentId: string;
  score: number | null;
  status: GradeEntryStatus;
  enteredByUserId: string;
  enteredAt: Date;
  approvedByUserId?: string;
  approvedAt?: Date;
  publishedAt?: Date;
  note?: string;
};

export type CourseGradeSummary = {
  earnedPercent: number | null;
  completedWeightPercent: number;
  missingAssessmentIds: string[];
};

export function validateAssessmentPlan(items: AssessmentItem[]) {
  const active = items.filter((item) => item.active);
  const totalWeight = active.reduce((sum, item) => sum + item.weightPercent, 0);
  const invalid = active.filter((item) => item.maxScore <= 0 || item.weightPercent < 0 || item.weightPercent > 100);
  return {
    valid: invalid.length === 0 && Math.abs(totalWeight - 100) < 0.001,
    totalWeight,
    invalidAssessmentIds: invalid.map((item) => item.id),
  };
}

export function calculateCourseGrade(items: AssessmentItem[], grades: StudentAssessmentGrade[]): CourseGradeSummary {
  const active = items.filter((item) => item.active);
  let weightedEarned = 0;
  let completedWeight = 0;
  const missing: string[] = [];

  for (const item of active) {
    const grade = grades.find((candidate) => candidate.assessmentId === item.id);
    if (!grade || grade.score === null) {
      missing.push(item.id);
      continue;
    }
    const bounded = Math.max(0, Math.min(grade.score, item.maxScore));
    weightedEarned += (bounded / item.maxScore) * item.weightPercent;
    completedWeight += item.weightPercent;
  }

  return {
    earnedPercent: completedWeight === 0 ? null : Math.round((weightedEarned / completedWeight) * 10000) / 100,
    completedWeightPercent: Math.round(completedWeight * 100) / 100,
    missingAssessmentIds: missing,
  };
}

export function canStudentSeeAssessmentGrade(grade: StudentAssessmentGrade) {
  return grade.status === "published";
}

export function transitionGradeStatus(current: GradeEntryStatus, next: GradeEntryStatus, role: "teacher" | "academic-officer" | "admin") {
  const allowed: Record<GradeEntryStatus, Partial<Record<typeof role, GradeEntryStatus[]>>> = {
    draft: { teacher: ["submitted"], "academic-officer": ["approved", "returned"], admin: ["approved", "published", "returned"] },
    submitted: { teacher: ["draft"], "academic-officer": ["approved", "returned"], admin: ["approved", "returned"] },
    approved: { "academic-officer": ["published", "returned"], admin: ["published", "returned"] },
    published: { "academic-officer": ["returned"], admin: ["returned"] },
    returned: { teacher: ["draft", "submitted"], "academic-officer": ["approved"], admin: ["approved", "published"] },
  };
  return allowed[current]?.[role]?.includes(next) ?? false;
}
