import assert from "node:assert/strict";
import test from "node:test";
import { activateCohort, createNextMembership, decideRollover, validateCohort, type AcademicCohort, type CohortMembership } from "./cohorts.ts";

const cohort: AcademicCohort = {
  id: "cohort-2026",
  academicYear: "2026-2027",
  label: "Academic Year 2026-2027",
  curriculumVersionId: "curriculum-2026",
  status: "planning",
  createdAt: "2026-09-01T00:00:00Z",
};

test("cohort validates and activates only with active curriculum", () => {
  assert.deepEqual(validateCohort(cohort), []);
  assert.throws(() => activateCohort(cohort, "draft", "2026-09-02T00:00:00Z"));
  assert.equal(activateCohort(cohort, "active", "2026-09-02T00:00:00Z").status, "active");
});

test("approved active student advances one semester", () => {
  assert.deepEqual(decideRollover({ enrollmentId: "e1", studentId: "s1", currentYearLevel: 1, currentSemester: 2, enrollmentStatus: "active", promotionApproved: true }), {
    action: "advance",
    nextYearLevel: 2,
    nextSemester: 3,
  });
});

test("unapproved student is held", () => {
  assert.deepEqual(decideRollover({ enrollmentId: "e1", studentId: "s1", currentYearLevel: 1, currentSemester: 2, enrollmentStatus: "active", promotionApproved: false }), {
    action: "hold",
    reason: "promotion_not_approved",
  });
});

test("semester eight completes the programme", () => {
  assert.deepEqual(decideRollover({ enrollmentId: "e1", studentId: "s1", currentYearLevel: 4, currentSemester: 8, enrollmentStatus: "active", promotionApproved: true }), { action: "complete-program" });
});

test("next membership preserves student and enrollment identity", () => {
  const current: CohortMembership = { id: "c1:e1", cohortId: "c1", enrollmentId: "e1", studentId: "s1", yearLevel: 1, semester: 2, status: "active", startedAt: "2026-09-01" };
  const decision = decideRollover({ enrollmentId: "e1", studentId: "s1", currentYearLevel: 1, currentSemester: 2, enrollmentStatus: "active", promotionApproved: true });
  const next = createNextMembership(current, "c2", decision, "2027-09-01");
  assert.equal(next?.enrollmentId, "e1");
  assert.equal(next?.studentId, "s1");
  assert.equal(next?.semester, 3);
});
