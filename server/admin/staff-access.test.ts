import assert from "node:assert/strict";
import test from "node:test";
import { applyStaffMutation, canAssignTeacher, canManageStaff, effectiveStaffAccess, validateStaffMember } from "./staff-access.ts";

const base = {
  id: "staff-1",
  email: "teacher@espoparis.com",
  displayName: "Teacher",
  role: "teacher" as const,
  status: "active" as const,
  offeringIds: ["fiqh-1"],
  createdAt: "2026-09-06T00:00:00Z",
  updatedAt: "2026-09-06T00:00:00Z",
};

test("only admin manages staff identity and role", () => {
  assert.equal(canManageStaff("admin"), true);
  assert.equal(canManageStaff("academic-officer"), false);
});

test("academic officer or admin can assign teachers", () => {
  assert.equal(canAssignTeacher("academic-officer"), true);
  assert.equal(canAssignTeacher("admin"), true);
  assert.equal(canAssignTeacher("teacher"), false);
});

test("teacher assignment is idempotent", () => {
  const updated = applyStaffMutation(base, { type: "assign-offering", offeringId: "fiqh-1" }, "academic-officer", "now");
  assert.deepEqual(updated.offeringIds, ["fiqh-1"]);
});

test("changing a teacher to non-teacher clears course assignments", () => {
  const updated = applyStaffMutation(base, { type: "change-role", role: "finance" }, "admin", "now");
  assert.deepEqual(updated.offeringIds, []);
});

test("suspended staff have no effective access", () => {
  assert.equal(effectiveStaffAccess({ ...base, status: "suspended" }), false);
});

test("validator rejects course assignments on non-teacher roles", () => {
  assert.ok(validateStaffMember({ ...base, role: "finance" }).includes("non_teacher_has_offerings"));
});
