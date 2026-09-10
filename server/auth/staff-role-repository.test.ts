import assert from "node:assert/strict";
import test from "node:test";
import { effectiveRoleFromStaffRecord, parseTrustedStaffRoleRecord } from "./staff-role-repository.ts";

const activeEditor = { email: "editor@espoparis.com", role: "editor" as const, status: "active" as const };

test("active staff receive their persisted role", () => {
  assert.equal(effectiveRoleFromStaffRecord("member", activeEditor, false), "editor");
});

test("inactive staff and repository failures remove managed permissions", () => {
  assert.equal(effectiveRoleFromStaffRecord("editor", { ...activeEditor, status: "suspended" }, false), "member");
  assert.equal(effectiveRoleFromStaffRecord("teacher", { ...activeEditor, status: "departed" }, false), "member");
  assert.equal(effectiveRoleFromStaffRecord("finance", null, false), "member");
});

test("admin remains controlled by the master allowlist", () => {
  assert.equal(effectiveRoleFromStaffRecord("member", { ...activeEditor, role: "admin" }, false), "member");
  assert.equal(effectiveRoleFromStaffRecord("member", null, true), "admin");
});

test("staff adapter rejects malformed or mismatched records", () => {
  assert.equal(parseTrustedStaffRoleRecord({ ...activeEditor, email: "other@espoparis.com" }, activeEditor.email), null);
  assert.equal(parseTrustedStaffRoleRecord({ ...activeEditor, role: "owner" }, activeEditor.email), null);
  assert.deepEqual(parseTrustedStaffRoleRecord(activeEditor, "EDITOR@ESPOPARIS.COM"), activeEditor);
});
