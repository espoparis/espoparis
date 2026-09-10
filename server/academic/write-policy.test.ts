import test from "node:test";
import assert from "node:assert/strict";
import { canPerformAcademicWrite, gradeRecordKey, validateGradeScore } from "./write-policy.ts";

const teacher = { email: "teacher@espoparis.com", role: "teacher" as const, active: true, offeringIds: ["fiqh-1"] };

test("teacher can write only assigned offering drafts and attendance", () => {
  assert.equal(canPerformAcademicWrite({ staff: teacher, action: "grade.save-draft", offeringId: "fiqh-1" }), true);
  assert.equal(canPerformAcademicWrite({ staff: teacher, action: "attendance.record", offeringId: "fiqh-1" }), true);
  assert.equal(canPerformAcademicWrite({ staff: teacher, action: "grade.publish", offeringId: "fiqh-1" }), false);
  assert.equal(canPerformAcademicWrite({ staff: teacher, action: "grade.save-draft", offeringId: "aqidah-1" }), false);
});

test("academic officer reviews and publishes but does not enter teacher drafts", () => {
  const officer = { email: "academic@espoparis.com", role: "academic-officer" as const, active: true, offeringIds: [] };
  assert.equal(canPerformAcademicWrite({ staff: officer, action: "grade.approve", offeringId: "x" }), true);
  assert.equal(canPerformAcademicWrite({ staff: officer, action: "grade.publish", offeringId: "x" }), true);
  assert.equal(canPerformAcademicWrite({ staff: officer, action: "grade.save-draft", offeringId: "x" }), false);
});

test("inactive staff cannot write", () => {
  assert.equal(canPerformAcademicWrite({ staff: { ...teacher, active: false }, action: "grade.save-draft", offeringId: "fiqh-1" }), false);
});

test("grade key is stable and score validation respects assessment maximum", () => {
  assert.equal(gradeRecordKey("enr-1", "midterm"), "enr-1::midterm");
  assert.deepEqual(validateGradeScore(18, 20), { valid: true, reason: "ok" });
  assert.equal(validateGradeScore(21, 20).valid, false);
  assert.equal(validateGradeScore(null, 20).valid, true);
});
