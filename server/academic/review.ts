import type { AssessmentItem, StudentAssessmentGrade } from './assessment.ts';
import { calculateCourseGrade } from './assessment.ts';

export type ReviewDecision = 'approve' | 'return';

export type GradeReviewItem = {
  enrollmentId: string;
  studentName: string;
  grades: StudentAssessmentGrade[];
};

export type ReviewFinding = {
  enrollmentId: string;
  ready: boolean;
  earnedPercent: number | null;
  missingAssessmentIds: string[];
  issues: string[];
};

export function reviewStudentGrades(assessments: AssessmentItem[], item: GradeReviewItem): ReviewFinding {
  const summary = calculateCourseGrade(assessments, item.grades);
  const issues: string[] = [];
  if (summary.missingAssessmentIds.length) issues.push('missing-assessments');
  if (item.grades.some((g) => g.status !== 'submitted' && g.status !== 'approved' && g.status !== 'published')) issues.push('unsubmitted-grades');
  if (item.grades.some((g) => g.score !== null && !Number.isFinite(g.score))) issues.push('invalid-score');
  return {
    enrollmentId: item.enrollmentId,
    ready: issues.length === 0,
    earnedPercent: summary.earnedPercent,
    missingAssessmentIds: summary.missingAssessmentIds,
    issues,
  };
}

export function canPublishGradeBatch(findings: ReviewFinding[]) {
  return findings.length > 0 && findings.every((f) => f.ready);
}

export function calculateSemesterAverage(coursePercentages: Array<number | null | undefined>) {
  const values = coursePercentages.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}
