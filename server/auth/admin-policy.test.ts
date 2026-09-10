import assert from "node:assert/strict";
import test from "node:test";
import { canOpenAdminSection, isMasterAdmin } from "./admin-policy.ts";
import { isMasterAdminEmail, parseMasterAdminEmails } from "./master-admin.ts";
import type { AuthSession } from "./types.ts";
import type { UserRole } from "../platform/types.ts";

const session = (role: UserRole): AuthSession => ({
  authenticated: true,
  identity: { id: role, email: `${role}@espoparis.com`, role, provider: "google-workspace" },
});

const anonymous: AuthSession = { authenticated: false, identity: null };

test("admin area rejects anonymous visitors", () => {
  assert.deepEqual(canOpenAdminSection(anonymous, "root"), { allowed: false, reason: "sign-in-required" });
});

test("students and teachers cannot enter the admin area", () => {
  assert.deepEqual(canOpenAdminSection(session("student"), "root"), { allowed: false, reason: "insufficient-role" });
  assert.deepEqual(canOpenAdminSection(session("teacher"), "root"), { allowed: false, reason: "insufficient-role" });
});

test("editor is restricted to content administration", () => {
  assert.equal(canOpenAdminSection(session("editor"), "root").allowed, true);
  assert.equal(canOpenAdminSection(session("editor"), "content").allowed, true);
  assert.equal(canOpenAdminSection(session("editor"), "academic").allowed, false);
  assert.equal(canOpenAdminSection(session("editor"), "site-settings").allowed, false);
});

test("academic officer is restricted to academic administration", () => {
  assert.equal(canOpenAdminSection(session("academic-officer"), "root").allowed, true);
  assert.equal(canOpenAdminSection(session("academic-officer"), "academic").allowed, true);
  assert.equal(canOpenAdminSection(session("academic-officer"), "content").allowed, false);
});

test("master admin can enter all protected sections", () => {
  const admin = session("admin");
  assert.equal(isMasterAdmin(admin), true);
  for (const section of ["root", "content", "academic", "digital-library", "digital-learning", "site-settings", "permissions"] as const) {
    assert.equal(canOpenAdminSection(admin, section).allowed, true);
  }
});

test("master admin allowlist is normalized and exact", () => {
  const allowlist = parseMasterAdminEmails(" Owner@ESPOParis.com, second@espoparis.com ");
  assert.equal(allowlist.has("owner@espoparis.com"), true);
  assert.equal(isMasterAdminEmail("OWNER@espoparis.com", "owner@espoparis.com"), true);
  assert.equal(isMasterAdminEmail("attacker@espoparis.com", "owner@espoparis.com"), false);
});

test("digital administration is split by responsibility", () => {
  assert.equal(canOpenAdminSection(session("editor"), "digital-library").allowed, true);
  assert.equal(canOpenAdminSection(session("editor"), "digital-learning").allowed, false);
  assert.equal(canOpenAdminSection(session("academic-officer"), "digital-library").allowed, false);
  assert.equal(canOpenAdminSection(session("academic-officer"), "digital-learning").allowed, true);
});
