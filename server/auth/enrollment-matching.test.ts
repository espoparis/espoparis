import assert from "node:assert/strict";
import test from "node:test";
import { buildStudentNumber, linkEnrollmentToUser, matchEnrollmentByVerifiedEmail, type EnrollmentRecord } from "./enrollment-matching.ts";

const base: EnrollmentRecord = {
  id: "enr-1",
  applicantEmail: "Student@Example.com",
  academicYear: "2026-2027",
  yearLevel: 1,
  semester: 1,
  status: "accepted",
};

test("matches accepted enrollment by normalized verified email", () => {
  assert.deepEqual(matchEnrollmentByVerifiedEmail(" student@example.com ", base), {
    matched: true,
    reason: "accepted-email-match",
    enrollmentId: "enr-1",
  });
});

test("does not link pending enrollment", () => {
  assert.equal(matchEnrollmentByVerifiedEmail("student@example.com", { ...base, status: "pending" }).matched, false);
});

test("does not relink an enrollment already attached to another account", () => {
  assert.equal(matchEnrollmentByVerifiedEmail("student@example.com", { ...base, userId: "user-existing" }).reason, "already-linked");
});

test("linking accepted enrollment activates it and assigns student number", () => {
  const linked = linkEnrollmentToUser(base, "user-1", "ESPO-2026-00001");
  assert.equal(linked.status, "active");
  assert.equal(linked.userId, "user-1");
  assert.equal(linked.studentNumber, "ESPO-2026-00001");
});

test("student numbers are deterministic display identifiers", () => {
  assert.equal(buildStudentNumber(42, 2026), "ESPO-2026-00042");
});
