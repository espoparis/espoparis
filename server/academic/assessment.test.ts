import test from "node:test";
import assert from "node:assert/strict";
import { calculateCourseGrade, canStudentSeeAssessmentGrade, transitionGradeStatus, validateAssessmentPlan } from "./assessment.ts";

const items = [
  { id: "mid", courseOfferingId: "c1", title: "Midterm", kind: "midterm" as const, maxScore: 40, weightPercent: 40, active: true },
  { id: "final", courseOfferingId: "c1", title: "Final", kind: "final" as const, maxScore: 60, weightPercent: 60, active: true },
];

test("assessment plan must total 100 percent", () => {
  assert.equal(validateAssessmentPlan(items).valid, true);
});

test("course grade is normalized over completed work", () => {
  const result = calculateCourseGrade(items, [{ enrollmentId: "e1", assessmentId: "mid", score: 32, status: "draft", enteredByUserId: "t1", enteredAt: new Date() }]);
  assert.equal(result.earnedPercent, 80);
  assert.equal(result.completedWeightPercent, 40);
  assert.deepEqual(result.missingAssessmentIds, ["final"]);
});

test("students only see published grades", () => {
  assert.equal(canStudentSeeAssessmentGrade({ enrollmentId: "e1", assessmentId: "mid", score: 30, status: "approved", enteredByUserId: "t1", enteredAt: new Date() }), false);
  assert.equal(canStudentSeeAssessmentGrade({ enrollmentId: "e1", assessmentId: "mid", score: 30, status: "published", enteredByUserId: "t1", enteredAt: new Date() }), true);
});

test("teachers cannot publish final grades", () => {
  assert.equal(transitionGradeStatus("submitted", "published", "teacher"), false);
  assert.equal(transitionGradeStatus("approved", "published", "academic-officer"), true);
});
