import test from "node:test";
import assert from "node:assert/strict";
import { approveProgression, evaluateProgressionReadiness } from "./progression-workflow.ts";

const base = { enrollmentId:"e1", yearLevel:1 as const, semester:2 as const, standing:"passed" as const, allRequiredGradesPublished:true, attendanceComplete:true };

test("eligible student receives next-term recommendation", () => {
  const r = evaluateProgressionReadiness(base);
  assert.equal(r.ready, true);
  if (r.ready) { assert.equal(r.recommendation.decision, "promote"); assert.equal(r.recommendation.nextSemester, 3); assert.equal(r.recommendation.nextYearLevel, 2); }
});

test("promotion is blocked while grades are unpublished", () => {
  const r = evaluateProgressionReadiness({ ...base, allRequiredGradesPublished:false });
  assert.deepEqual(r, { ready:false, reason:"grades-not-published" });
});

test("approval creates an auditable decision", () => {
  const approvedAt = new Date("2026-09-05T10:00:00Z");
  const d = approveProgression({ candidate:base, approvedByUserId:"admin-1", approvedAt });
  assert.equal(d.decision, "promote");
  assert.equal(d.nextSemester, 3);
  assert.equal(d.approvedByUserId, "admin-1");
});
