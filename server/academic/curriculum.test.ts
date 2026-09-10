import assert from "node:assert/strict";
import test from "node:test";
import { activateCurriculum, applyCurriculumMutation, cloneCurriculumForNextYear, validateCurriculum, type CurriculumVersion } from "./curriculum.ts";

const base: CurriculumVersion = {
  id: "curr-2026",
  academicYear: "2026-2027",
  label: "Academic Program",
  status: "draft",
  createdAt: "2026-09-06T00:00:00Z",
  subjects: [
    { id: "fiqh-1", code: "FIQH-1", name: "Fiqh 1", yearLevel: 1, semester: 1, displayOrder: 1, status: "active" },
  ],
};

test("valid curriculum has no issues", () => {
  assert.deepEqual(validateCurriculum(base), []);
});

test("detects year semester mismatch", () => {
  const bad = { ...base, subjects: [{ ...base.subjects[0], yearLevel: 2 as const }] };
  assert.ok(validateCurriculum(bad).includes("year_semester_mismatch:fiqh-1"));
});

test("active curriculum is immutable", () => {
  const active = { ...base, status: "active" as const };
  assert.throws(() => applyCurriculumMutation(active, { type: "deactivate-subject", subjectId: "fiqh-1" }), /immutable/);
});

test("draft curriculum can add a subject", () => {
  const next = applyCurriculumMutation(base, { type: "add-subject", subject: { id: "aqidah-1", code: "AQIDAH-1", name: "Aqidah 1", yearLevel: 1, semester: 1, displayOrder: 2, status: "active" } });
  assert.equal(next.subjects.length, 2);
});

test("activation validates and locks version", () => {
  const active = activateCurriculum(base, "2026-09-06T01:00:00Z");
  assert.equal(active.status, "active");
  assert.equal(active.activatedAt, "2026-09-06T01:00:00Z");
});

test("cloning preserves history and creates a draft", () => {
  const active = activateCurriculum(base, "2026-09-06T01:00:00Z");
  const clone = cloneCurriculumForNextYear(active, "2027-2028", "curr-2027", "2027-06-01T00:00:00Z");
  assert.equal(clone.status, "draft");
  assert.equal(clone.academicYear, "2027-2028");
  assert.notEqual(clone.id, active.id);
  assert.deepEqual(clone.subjects, active.subjects);
});
