import assert from "node:assert/strict";
import test from "node:test";
import { canAccessResource } from "./access.ts";
import type { Viewer } from "./types.ts";

const visitor: Viewer = { role: "visitor", authenticated: false };
const member: Viewer = { role: "member", authenticated: true, userId: "member-1" };
const student: Viewer = { role: "student", authenticated: true, userId: "student-1" };
const academicOfficer: Viewer = { role: "academic-officer", authenticated: true, userId: "officer-1" };
const editor: Viewer = { role: "editor", authenticated: true, userId: "editor-1" };
const paidMember: Viewer = {
  role: "member",
  authenticated: true,
  userId: "member-2",
  entitlementResourceIds: ["course-fiqh-1"],
};

test("public resources are available to visitors", () => {
  assert.equal(canAccessResource(visitor, "public", "book-1").allowed, true);
});

test("registered-free resources require authentication", () => {
  assert.equal(canAccessResource(visitor, "registered-free", "book-2").allowed, false);
  assert.equal(canAccessResource(member, "registered-free", "book-2").allowed, true);
});

test("student-only resources require a student or privileged admin role", () => {
  assert.equal(canAccessResource(student, "student-only", "lesson-1").allowed, true);
  assert.equal(canAccessResource(academicOfficer, "student-only", "lesson-1").allowed, false);
  assert.equal(canAccessResource(editor, "student-only", "lesson-1").allowed, false);
  assert.equal(canAccessResource(member, "student-only", "lesson-1").allowed, false);
});

test("paid resources require an explicit entitlement unless privileged", () => {
  assert.equal(canAccessResource(member, "paid", "course-fiqh-1").allowed, false);
  assert.equal(canAccessResource(paidMember, "paid", "course-fiqh-1").allowed, true);
});
