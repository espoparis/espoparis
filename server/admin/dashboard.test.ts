import assert from "node:assert/strict";
import test from "node:test";
import { getAdminModules, getAdminRoleLabel } from "./dashboard.ts";
import type { AuthSession } from "../auth/types.ts";
import type { UserRole } from "../platform/types.ts";

function session(role: UserRole): AuthSession {
  return { authenticated: true, identity: { id: "u1", email: "staff@espoparis.com", role, provider: "google-workspace" } };
}

test("admin sees all dashboard modules unlocked or staged", () => {
  const modules = getAdminModules(session("admin"));
  assert.equal(modules.filter((m) => m.state === "locked").length, 0);
});

test("editor can open content but not academic or permissions modules", () => {
  const modules = getAdminModules(session("editor"));
  assert.equal(modules.find((m) => m.key === "content")?.state, "available");
  assert.equal(modules.find((m) => m.key === "academic")?.state, "locked");
  assert.equal(modules.find((m) => m.key === "people")?.state, "locked");
});

test("academic officer can open academic but not content", () => {
  const modules = getAdminModules(session("academic-officer"));
  assert.equal(modules.find((m) => m.key === "academic")?.state, "available");
  assert.equal(modules.find((m) => m.key === "content")?.state, "locked");
});

test("role labels are explicit", () => {
  assert.equal(getAdminRoleLabel("admin"), "master");
  assert.equal(getAdminRoleLabel("editor"), "editor");
  assert.equal(getAdminRoleLabel("academic-officer"), "academic");
  assert.equal(getAdminRoleLabel("teacher"), "staff");
});

test("people and site settings are available to master admin in phase 35", () => {
  const modules = getAdminModules(session("admin"));
  assert.equal(modules.find((m) => m.key === "people")?.state, "available");
  assert.equal(modules.find((m) => m.key === "settings")?.state, "available");
});

test("phase 39 exposes digital modules only to responsible roles", () => {
  const editor = getAdminModules(session("editor"));
  const academic = getAdminModules(session("academic-officer"));
  assert.equal(editor.find((m) => m.key === "library")?.state, "available");
  assert.equal(editor.find((m) => m.key === "learning")?.state, "locked");
  assert.equal(academic.find((m) => m.key === "library")?.state, "locked");
  assert.equal(academic.find((m) => m.key === "learning")?.state, "available");
});
