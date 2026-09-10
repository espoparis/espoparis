import assert from "node:assert/strict";
import test from "node:test";
import { canMutateCurriculum, createNextCurriculumVersion } from "./academic-control.ts";

test("only draft curriculum versions are directly mutable", () => {
  const base = {
    id: "c1",
    academicYear: "2026-2027",
    label: "Curriculum 2026-2027",
    effectiveFrom: new Date("2026-09-01"),
  };
  assert.equal(canMutateCurriculum({ ...base, status: "draft" }), true);
  assert.equal(canMutateCurriculum({ ...base, status: "active" }), false);
  assert.equal(canMutateCurriculum({ ...base, status: "archived" }), false);
});

test("next curriculum version is created as draft", () => {
  const next = createNextCurriculumVersion({
    current: {
      id: "c1",
      academicYear: "2026-2027",
      label: "Curriculum 2026-2027",
      status: "active",
      effectiveFrom: new Date("2026-09-01"),
    },
    nextAcademicYear: "2027-2028",
    effectiveFrom: new Date("2027-09-01"),
  });
  assert.equal(next.status, "draft");
  assert.equal(next.academicYear, "2027-2028");
});
