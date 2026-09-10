import assert from "node:assert/strict";
import test from "node:test";
import { canOpenStudentPortal, canUseAcademicWorkspace } from "./policy.ts";
import type { AuthSession } from "./types.ts";

const anonymous: AuthSession = { authenticated: false, identity: null };
const student: AuthSession = {
  authenticated: true,
  identity: { id: "u1", email: "student@example.com", role: "student", provider: "google-workspace" },
};
const teacher: AuthSession = {
  authenticated: true,
  identity: { id: "u2", email: "teacher@espoparis.com", role: "teacher", provider: "google-workspace" },
};

test("student portal requires authentication", () => {
  assert.deepEqual(canOpenStudentPortal(anonymous), { allowed: false, reason: "sign-in-required" });
  assert.equal(canOpenStudentPortal(student).allowed, true);
});

test("academic workspace enforces minimum role", () => {
  assert.equal(canUseAcademicWorkspace(student, "student").allowed, true);
  assert.deepEqual(canUseAcademicWorkspace(student, "teacher"), { allowed: false, reason: "insufficient-role" });
  assert.equal(canUseAcademicWorkspace(teacher, "teacher").allowed, true);
});

const officer: AuthSession = { authenticated: true, identity: { id: "u3", email: "academic@espoparis.com", role: "academic-officer", provider: "google-workspace" } };
const finance: AuthSession = { authenticated: true, identity: { id: "u4", email: "finance@espoparis.com", role: "finance", provider: "google-workspace" } };

test("academic officer can use officer workspace without giving finance teacher access", () => {
  assert.equal(canUseAcademicWorkspace(officer, "academic-officer").allowed, true);
  assert.deepEqual(canUseAcademicWorkspace(finance, "teacher"), { allowed: false, reason: "insufficient-role" });
});
