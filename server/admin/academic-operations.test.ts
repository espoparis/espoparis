import assert from "node:assert/strict";
import test from "node:test";
import { canPerformAcademicOperation, publishedGradesOnly, summarizeAttendance } from "./academic-operations.ts";

test("teachers may enter grades but cannot publish final grades", () => {
  assert.equal(canPerformAcademicOperation("teacher", "enter-grades"), true);
  assert.equal(canPerformAcademicOperation("teacher", "publish-grades"), false);
});

test("finance cannot change curriculum", () => {
  assert.equal(canPerformAcademicOperation("finance", "confirm-offline-payment"), true);
  assert.equal(canPerformAcademicOperation("finance", "edit-curriculum"), false);
});

test("attendance summary counts late as effective presence", () => {
  const at = new Date("2026-09-05T00:00:00Z");
  const summary = summarizeAttendance([
    { enrollmentId: "e1", lessonId: "l1", status: "present", recordedAt: at, source: "admin" },
    { enrollmentId: "e1", lessonId: "l2", status: "late", recordedAt: at, source: "admin" },
    { enrollmentId: "e1", lessonId: "l3", status: "absent", recordedAt: at, source: "admin" },
    { enrollmentId: "e1", lessonId: "l4", status: "excused", recordedAt: at, source: "admin" },
  ]);
  assert.equal(summary.attendanceRate, 50);
});

test("student-facing grade view excludes drafts", () => {
  const grades = [
    { enrollmentId: "e1", courseOfferingId: "c1", scale: "percentage" as const, earned: 80, possible: 100, published: true },
    { enrollmentId: "e1", courseOfferingId: "c2", scale: "percentage" as const, earned: 70, possible: 100, published: false },
  ];
  assert.equal(publishedGradesOnly(grades).length, 1);
});
