import assert from "node:assert/strict";
import test from "node:test";
import { canAssignManagedRole, canTransitionStaffAccess, hasCapability, sanitizeStaffEmail } from "./people-permissions.ts";

test("content editor cannot publish or manage permissions", () => {
  assert.equal(hasCapability("editor", "content:draft"), true);
  assert.equal(hasCapability("editor", "content:publish"), false);
  assert.equal(hasCapability("editor", "people:manage"), false);
});

test("academic officer can review academics but cannot manage site settings", () => {
  assert.equal(hasCapability("academic-officer", "academic:review"), true);
  assert.equal(hasCapability("academic-officer", "settings:manage"), false);
});

test("master admin owns all declared administrative capabilities", () => {
  for (const capability of ["content:draft", "content:publish", "academic:teach", "academic:review", "finance:review", "people:manage", "settings:manage"] as const) {
    assert.equal(hasCapability("admin", capability), true);
  }
});

test("staff lifecycle forbids silently reactivating departed staff", () => {
  assert.equal(canTransitionStaffAccess("active", "suspended"), true);
  assert.equal(canTransitionStaffAccess("suspended", "active"), true);
  assert.equal(canTransitionStaffAccess("departed", "active"), false);
});

test("only master admin assigns managed staff roles", () => {
  assert.equal(canAssignManagedRole("admin", "editor"), true);
  assert.equal(canAssignManagedRole("academic-officer", "teacher"), false);
  assert.equal(canAssignManagedRole("editor", "finance"), false);
});

test("staff emails are normalized before identity matching", () => {
  assert.equal(sanitizeStaffEmail("  STAFF@ESPOParis.com  "), "staff@espoparis.com");
});
