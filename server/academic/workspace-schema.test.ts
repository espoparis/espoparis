import test from "node:test";
import assert from "node:assert/strict";
import { academicWorkspaceReady, academicWorkspaceSheets, assertAssessmentWeights, auditAcademicWorkspace } from "./workspace-schema.ts";

test("canonical academic workspace passes audit", () => {
  const input = Object.fromEntries(Object.values(academicWorkspaceSheets).map((sheet) => [sheet.name, [...sheet.headers]]));
  const issues = auditAcademicWorkspace(input);
  assert.equal(issues.length, 0);
  assert.equal(academicWorkspaceReady(issues), true);
});

test("missing academic sheet is blocking", () => {
  const input = Object.fromEntries(Object.values(academicWorkspaceSheets).slice(1).map((sheet) => [sheet.name, [...sheet.headers]]));
  const issues = auditAcademicWorkspace(input);
  assert.equal(issues.some((issue) => issue.code === "missing-sheet" && issue.blocking), true);
  assert.equal(academicWorkspaceReady(issues), false);
});

test("header order drift is reported but not blocking when all headers exist", () => {
  const input = Object.fromEntries(Object.values(academicWorkspaceSheets).map((sheet) => [sheet.name, [...sheet.headers]]));
  input[academicWorkspaceSheets.staff.name] = ["Role", "Email", "Active", "Allowed Offering Ids"];
  const issues = auditAcademicWorkspace(input);
  assert.equal(issues.some((issue) => issue.code === "unexpected-order"), true);
  assert.equal(academicWorkspaceReady(issues), true);
});

test("assessment weights must total 100 for active assessments", () => {
  assert.deepEqual(assertAssessmentWeights([{ active: true, weight: 40 }, { active: true, weight: 60 }]), { valid: true, total: 100, reason: null });
  assert.equal(assertAssessmentWeights([{ active: true, weight: 50 }, { active: true, weight: 40 }]).valid, false);
});
