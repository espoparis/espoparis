import test from "node:test";
import assert from "node:assert/strict";
import { recommendNextTerm } from "./records.ts";

test("recommends the next semester after a passed term", () => {
  assert.deepEqual(recommendNextTerm({ yearLevel: 1, semester: 1, standing: "passed" }), {
    decision: "promote", nextSemester: 2, nextYearLevel: 1,
  });
});

test("moves semester 2 students to year 2 semester 3", () => {
  assert.deepEqual(recommendNextTerm({ yearLevel: 1, semester: 2, standing: "passed" }), {
    decision: "promote", nextSemester: 3, nextYearLevel: 2,
  });
});

test("never auto-promotes a non-passing record", () => {
  assert.deepEqual(recommendNextTerm({ yearLevel: 2, semester: 4, standing: "conditional" }), { decision: "hold" });
});

test("completes the program after semester 8", () => {
  assert.deepEqual(recommendNextTerm({ yearLevel: 4, semester: 8, standing: "completed" }), { decision: "complete-program" });
});
