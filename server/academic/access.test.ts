import assert from "node:assert/strict";
import test from "node:test";
import { canAccessCourseOffering } from "./access.ts";
import type { AcademicEnrollment, CourseOffering } from "./types.ts";

const academicOffering: CourseOffering = {
  id: "offering-fiqh-1",
  courseId: "fiqh-1",
  academicYear: "2026-2027",
  semester: 1,
  accessLevel: "student-only",
  learningTrack: "academic-program",
  purchasable: false,
  published: true,
};

const enrollment: AcademicEnrollment = {
  id: "enrollment-1",
  userId: "student-1",
  academicYear: "2026-2027",
  programId: "hawza-main",
  yearLevel: 1,
  semester: 1,
  status: "active",
  source: "admissions",
};

test("official student gets academic course through enrollment", () => {
  assert.equal(
    canAccessCourseOffering({ userId: "student-1", offering: academicOffering, enrollments: [enrollment], entitlements: [] }).reason,
    "academic-enrollment",
  );
});

test("standalone purchase does not grant the whole academic semester", () => {
  const decision = canAccessCourseOffering({
    userId: "buyer-1",
    offering: academicOffering,
    enrollments: [],
    entitlements: [{ userId: "buyer-1", resourceKind: "course", resourceId: "some-other-course", source: "purchase" }],
  });
  assert.equal(decision.allowed, false);
});

test("purchased standalone course is granted only by matching entitlement", () => {
  const offering: CourseOffering = { ...academicOffering, id: "ethics-short", learningTrack: "standalone-course", accessLevel: "paid", purchasable: true };
  const decision = canAccessCourseOffering({
    userId: "buyer-1",
    offering,
    enrollments: [],
    entitlements: [{ userId: "buyer-1", resourceKind: "course", resourceId: "ethics-short", source: "purchase" }],
  });
  assert.deepEqual(decision, { allowed: true, reason: "purchase" });
});
